var fs = require("fs-extra");
var path = require("path");
var express = require("express");
var bodyParser = require("body-parser");
var archiver = require("archiver");
var url = require("url");
var app = express();
var server = require("http").Server(app);
var io = require("socket.io")(server);

var socket;
server.listen((process.env.PORT || 3000), function () {
  console.log("Server started: http://localhost:" + app.get("port") + "/");
});

app.use("/", express.static(path.join(__dirname, "../app")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "no-cache");
  next();
});

var clientDisconnects = false;
io.on("connection", function (_socket) {
  socket = _socket;

  // abort any bundling or zipping process if client disconnects
  socket.on("disconnect", function () {
    clientDisconnects = true;
  });
});

var outputContainer = path.join(__dirname, "output");
var extensionsZip = "extensions.zip";
var retryAttempt = 0;

app.post("/submit", function (req, res) {
  if (!req.body || !req.body.urlString) {
    let errorMessage = "request contains invalid parameters. Make sure URL is correct";
    res.status(400).send({ message: errorMessage });
    socket.emit("update", { message: errorMessage, serverNotBusy: true });
    return;
  }

  let isPortal = (req.body.isPortalSelected === "true");
  let urlString = req.body.urlString.trim();
  let extensionsDirName = isPortal ? "jsapi-bundled" : "opsDashboardExtensions";
  let jsapiUrl = getJsapiUrl(isPortal, urlString, extensionsDirName); // get the JSAPI URL without the protocol part 

  socket.emit("update", { message: "started creating extension bundle", serverNotBusy: false });
  let extensionsUrl = url.parse(urlString, true, true).protocol + "//" + path.join(jsapiUrl, "../");
  res.status(200).send({ message: extensionsUrl });

  // bundle the extension and JSAPI files 
  let extensionsDir = path.join(outputContainer, extensionsDirName)
  createBundle(extensionsDir, jsapiUrl).then(function (result) {
    if (!result) {
      socket.emit("update", { message: "error occurred when creating a bundle, please retry", serverNotBusy: true })
      return;
    }

    socket.emit("update", { message: "bundling is done. start zipping", serverNotBusy: false });
    zip(extensionsDir);

  }, function (err) {
    socket.emit("update", { message: "error occurred when creating a bundle, please retry", serverNotBusy: true });
  });

});

function createBundle(extensionsDir, jsapiUrl) {
  // create the bundle by copying the source files to the output location, then updating the JSAPI path

  return new Promise(function (resolve, reject) {
    // empty the content in the output's container folder without deleting the container itself 
    // the container will be created if it does not exist
    fs.emptydir(outputContainer, function (err) {
      if (err)
        return reject(false);

      // copy API and extensions from the source folder "data" to the output folder "extensionsDir"
      fs.copy(path.join(__dirname, "data"), extensionsDir, function (err) {

        // files do not exist in the source location
        if (err)
          return reject(false);

        // delete the bundle if client has disconnected 
        if (clientDisconnects) {
          fs.emptydir(outputContainer, function (err) {
            clientDisconnects = false;
          });
          return reject(false);
        }

        // replace text in the API and extension files
        let apiFolder = path.join(extensionsDir, path.basename(jsapiUrl));
        let apiFilePaths = [path.join(apiFolder, "init.js"), path.join(apiFolder, "dojo/dojo.js")];
        let regex = new RegExp(/\[HOSTNAME_AND_PATH_TO_JSAPI\]/, "gi");
        apiFilePaths.forEach(function (path) {
          replaceText(path, regex, jsapiUrl);
        });

        let extensionFiles = getFilePathsRecursive(extensionsDir, apiFolder);
        if (extensionFiles) {
          extensionFiles.forEach(function (path) {
            replaceText(path, regex, jsapiUrl);
          });
        }

        resolve(true);
      });
    });
  });
}

function zip(extensionsDir) {
  // zip the bundle folder

  let intervalId;
  let lastZippedSize = -1;

  // if zipping hasn't started when the client disconnects, delete the bundle
  if (clientDisconnects) {
    clearInterval(intervalId);

    fs.remove(outputContainer, function (err) {
      clientDisconnects = false;
    });
  }

  try {
    fs.accessSync(extensionsDir);

    // create the write stream
    let writeStream = fs.createWriteStream(path.join(outputContainer, extensionsZip));

    writeStream.on("close", function () {
      clearInterval(intervalId);
      retryAttempt = 0;

      let dataInMB = Math.round(archive.pointer() / 1000000, -1);
      socket.emit("update", { message: `zipping done. ${dataInMB} MB of data have been zipped`, serverNotBusy: true, success: true });
    });

    writeStream.on("error", function () {
      fs.emptydir(outputContainer, function (err) {
        socket.emit("update", { message: "error occurred during zipping. Please try again", serverNotBusy: true });
      });
      return;
    })

    // start zipping 
    let archive = archiver("zip", { level: 9 });

    archive.on("error", function (err) {
      fs.emptyDirSync(outputContainer);
      socket.emit("update", { message: "error occurred during zipping. Please try again", serverNotBusy: true });
      return;
    });

    archive.on("entry", function (obj) {
      // if zipping has started when the client disconnects, abort the zipping
      if (clientDisconnects) {
        archive.unpipe(writeStream);
        writeStream.end();
        clientDisconnects = false;
      }

      lastZippedSize = archive.pointer();
    })

    archive.pipe(writeStream);

    // folder structure inside the .zip file 
    archive.directory(extensionsDir, path.basename(extensionsDir));

    archive.finalize();

    // recovery mode: kick off a timer to check if the zip process stops unexpectedly
    intervalId = setInterval(function () {

      if (retryAttempt === 3) {
        clearInterval(intervalId);
        socket.emit("update", { message: "failed to zip after 3 attempts. Please try again", serverNotBusy: true });
        return;
      }

      let currentZippedSize = archive.pointer();
      socket.emit("update", { message: `${currentZippedSize} bytes of data have been zipped` });

      if (currentZippedSize > lastZippedSize)
        lastZippedSize = currentZippedSize;
      else {
        retryAttempt++;
        socket.emit("update", { message: "error occurred, retrying to zip", serverNotBusy: false });
        zip(extensionsDir);
      }
    }.bind(extensionsDir), 2000);
  } catch (err) {
    socket.emit("update", { message: "error occurred during zipping. Please try again", serverNotBusy: true });
  }
}

app.get("/downloadOutput", function (req, res) {

  // todo review if the logic here is enough
  // http://stackoverflow.com/questions/21578208/node-js-send-file-to-client

  let readStream = fs.createReadStream(path.join(__dirname, path.basename(outputContainer), extensionsZip));
  readStream.on("open", function () {
    readStream.pipe(res);
  });

  readStream.on("error", function (err) {
    res.end(err.message);
  });
});

// ***************** Helper methods ***************** 

function getFilePathsRecursive(folder, folderToExclude, filePaths) {
  filePaths = filePaths || [];

  let subFolder = fs.readdirSync(folder, "utf8");
  subFolder.map(function (subFolder) {
    let subFolderPath = path.join(folder, subFolder);

    if (subFolderPath.startsWith(folderToExclude))
      return;

    if (fs.statSync(subFolderPath).isDirectory())
      getFilePathsRecursive(subFolderPath, folderToExclude, filePaths);
    else
      filePaths.push(subFolderPath);
  });

  return filePaths;
}

function replaceText(path, regex, newText) {
  fs.readFile(path, "utf8", function (err, data) {
    if (err) {
      console.log("error reading " + path + ", details: " + err);
      return;
    }

    let updatedData = data.replace(regex, newText);
    fs.writeFile(path, updatedData, "utf8", function (err) {
      if (err)
        console.log("error writing into " + path + ", details: " + err);
    });
  });
}

function getJsapiUrl(isPortal, hostingUrl, extensionsDirName) {
  let parsedUrl = url.parse(hostingUrl, true, true);

  let host = parsedUrl.host;
  let _path = parsedUrl.pathname;

  if (!parsedUrl || !parsedUrl.protocol || !host || !_path) {
    // todo test this
    console.log("url is invalid");
    process.exit(1);
  }

  if (isPortal)
    return path.join(host, _path, "apps/dashboard/extensions", extensionsDirName, "arcgis_js_api/");
  else
    return path.join(host, _path, extensionsDirName, "arcgis_js_api/");
}