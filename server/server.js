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

var PORTAL_EXTENSIONS_DIR = "extensions";
var SERVER_EXTENTIONS_DIR = "opsDashboardExtensions"
var BUNDLE_DIR = "jsapi-bundled";
var JSAPI_DIR = "arcgis_js_api";
var clientDisconnects = false;
var retryAttempt = 0;
var sourceFolder = path.join(__dirname, "data");
var outputFolder = path.join(__dirname, "output");
var extensionsZip = "extensions.zip";

app.use("/", express.static(path.join(__dirname, "../app")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "no-cache");
  next();
});

io.on("connection", function (_socket) {
  socket = _socket;

  // abort any bundling or zipping process if client disconnects
  socket.on("disconnect", function () {
    clientDisconnects = true;
  });
});

app.post("/submit", function (req, res) {
  if (!req.body || !req.body.urlString) {
    let errorMessage = "request contains invalid parameters. Make sure URL is correct";
    res.status(400).send({ message: errorMessage });
    socket.emit("update", { message: errorMessage, serverNotBusy: true });
    return;
  }

  let isPortal = (req.body.isPortalSelected === "true");
  let urlString = req.body.urlString.trim();
  let jsapiUrl = getJsapiUrl(urlString, isPortal);
  let extensionsUrl = url.parse(urlString, true, true).protocol + "//" + path.join(jsapiUrl, "../");

  socket.emit("update", { message: "started creating extension bundle", serverNotBusy: false });
  res.status(200).send({ message: extensionsUrl });

  // bundle the extension and JSAPI files 
  var folderToBundle = isPortal ? path.join(outputFolder, BUNDLE_DIR) : path.join(outputFolder, SERVER_EXTENTIONS_DIR);
  createBundle(jsapiUrl, sourceFolder, folderToBundle).then(
    function (result) {
      if (!result) {
        socket.emit("update", { message: "error occurred when creating a bundle, please retry", serverNotBusy: true })
        return;
      }

      socket.emit("update", { message: "bundling is done. started zipping", serverNotBusy: false });
      var outputFolderName = isPortal ? PORTAL_EXTENSIONS_DIR : SERVER_EXTENTIONS_DIR;
      zip(folderToBundle, outputFolderName);

    }, function (err) {
      socket.emit("update", { message: "error occurred when creating a bundle, please retry", serverNotBusy: true });
    });

});

function createBundle(jsapiUrl, sourceFolder, folderToBundle) {
  // create the bundle by copying the source files to the output location, then updating the JSAPI path

  return new Promise(function (resolve, reject) {
    // empty the content in the output's container folder without deleting the container itself 
    // the container will be created if it does not exist
    fs.emptydir(outputFolder, function (err) {
      if (err)
        return reject(false);

      // copy API and extensions to the folder which will be bundled
      fs.copy(sourceFolder, folderToBundle, function (err) {

        // files might not exist in the source location
        if (err)
          return reject(false);

        // delete the bundle if client has disconnected 
        if (clientDisconnects) {
          fs.emptydir(outputFolder, function (err) {
            clientDisconnects = false;
          });
          return reject(false);
        }

        // replace text in the API and extension files
        var apiFolder = path.join(folderToBundle, JSAPI_DIR);
        var apiFilePaths = [path.join(apiFolder, "init.js"), path.join(apiFolder, "dojo/dojo.js")];
        var regex = new RegExp(/\[HOSTNAME_AND_PATH_TO_JSAPI\]/, "gi");
        apiFilePaths.forEach(function (path) {
          replaceText(path, regex, jsapiUrl);
        });

        var extensionFiles = getFilePathsRecursive(folderToBundle, apiFolder);
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

function zip(folderToZip, outputName) {
  // zip the bundle folder

  var intervalId;
  var lastZippedSize = -1;

  // if zipping hasn't started when the client disconnects, delete the bundle
  if (clientDisconnects) {
    clearInterval(intervalId);

    fs.remove(outputFolder, function (err) {
      clientDisconnects = false;
    });
  }

  try {
    fs.accessSync(folderToZip);

    // create the write stream
    // outputName + ".zip" will be the output file name
    // var writeStream = fs.createWriteStream(path.join(outputFolder, outputName + ".zip"));   // TODO: Don't change
    var writeStream = fs.createWriteStream(path.join(outputFolder, extensionsZip));   // TODO: Don't change

    writeStream.on("close", function () {
      clearInterval(intervalId);
      retryAttempt = 0;

      var dataInMB = Math.round(archive.pointer() / 1000000, -1);
      socket.emit("update", { message: "zipping done. " + dataInMB + "MB of data have been zipped", serverNotBusy: true, success: true });
    });

    writeStream.on("error", function () {
      fs.emptydir(outputFolder, function (err) {
        socket.emit("update", { message: "error occurred during zipping. Please try again", serverNotBusy: true });
      });
      return;
    })

    // start zipping 
    // var archive = archiver("zip", { level: 9 });
    var archive = archiver("zip");

    archive.on("error", function (err) {
      fs.emptyDirSync(outputFolder);
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
    var outputStructure = path.basename(folderToZip);  
    
    archive.directory(folderToZip, outputStructure);

    archive.finalize();

    // recovery mode: kick off a timer to check if the zip process stops unexpectedly
    intervalId = setInterval(function () {

      if (retryAttempt === 3) {
        clearInterval(intervalId);
        socket.emit("update", { message: "failed to zip after 3 attempts. Please try again", serverNotBusy: true });
        return;
      }

      var currentZippedSize = archive.pointer();
      socket.emit("update", { message: `${currentZippedSize} bytes of data have been zipped` });

      if (currentZippedSize > lastZippedSize)
        lastZippedSize = currentZippedSize;
      else {
        retryAttempt++;
        socket.emit("update", { message: "error occurred, retrying to zip", serverNotBusy: false });
        zip(folderToZip, outputName);
      }
    }.bind(folderToZip, outputName), 2000);
  } catch (err) {
    socket.emit("update", { message: "error occurred during zipping. Please try again", serverNotBusy: true });
  }
}

app.get("/downloadOutput", function (req, res) {

  // todo review if the logic here is enough
  // http://stackoverflow.com/questions/21578208/node-js-send-file-to-client

   var downloadPath = path.join(__dirname, path.basename(outputFolder), extensionsZip);

  var readStream = fs.createReadStream(downloadPath);
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

  var subFolder = fs.readdirSync(folder, "utf8");
  subFolder.map(function (subFolder) {
    var subFolderPath = path.join(folder, subFolder);

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

    var updatedData = data.replace(regex, newText);
    fs.writeFile(path, updatedData, "utf8", function (err) {
      if (err)
        console.log("error writing into " + path + ", details: " + err);
    });
  });
}

function getJsapiUrl(hostingUrl, isPortal) {
  var parsedUrl = url.parse(hostingUrl, true, true);

  if (!parsedUrl || !parsedUrl.protocol || !parsedUrl.host) {
    // todo test this
    console.log(`url is invalid`);
    process.exit(1);
  }
  var host = parsedUrl.host;
  var path = parsedUrl.pathname;

  if (isPortal)
    return concatUrlParts([host, path, "apps/dashboard", PORTAL_EXTENSIONS_DIR, BUNDLE_DIR, JSAPI_DIR]);
  else
    return concatUrlParts([host, path, SERVER_EXTENTIONS_DIR, JSAPI_DIR]);
}

function concatUrlParts(urlParts) {

  return urlParts.reduce(function (url, urlPart) {
    if (!urlPart.length)
      return url;

    urlPart = urlPart.startsWith("/") ? urlPart.slice(1) : urlPart;
    urlPart = urlPart.endsWith("/") ? urlPart : urlPart += "/";

    return url + urlPart;
  }, "");
}