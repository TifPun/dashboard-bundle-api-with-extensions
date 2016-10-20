var fs = require("fs-extra");
var path = require("path");
var express = require("express");
var bodyParser = require("body-parser");
var archiver = require("archiver");
var url = require("url");
var app = express();
var server = require('http').Server(app);

// Method 1
// var io = require("socket.io").listen(server);
// app.set("port", (process.env.PORT || 3000));
// var server = app.listen(app.get("port"), function(){
//   console.log("Server started: http://localhost:" + app.get("port") + "/");
// })

// Method 2
// see https://github.com/socketio/socket.io/issues/2075
var io = require("socket.io")(server);
var socket;
server.listen((process.env.PORT || 3000), function () {
  console.log("Server started: http://localhost:" + app.get("port") + "/");
});

var EXTENSIONS_DIR = "extensions";
var BUNDLE_DIR = "jsapi-bundled";
var JSAPI_DIR = "arcgis_js_api";

app.use("/", express.static(path.join(__dirname, "../app")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "no-cache");
  next();
});

io.on('connection', function (_socket) {
  socket = _socket;
});

app.post("/submit", function (req, res) {

  var sourceFolder = path.join(__dirname, "data");
  var bundleContainerFolder = path.join(__dirname, "output");
  var folderToBundle = path.join(bundleContainerFolder, BUNDLE_DIR);

  var urlString = req.body.urlString.trim();
  var isPortal = req.body.isPortalSelected;

  res.send({
    message: `Bundling begins`
  });

  // copy the source files to the output location, and update the JSAPI path
  var jsapiUrl = getJsapiUrl(urlString, isPortal);
  socket.emit("update", { message: `start bundling` });
  console.log("start bundling");
  createBundle(jsapiUrl, sourceFolder, folderToBundle, bundleContainerFolder).then(
    function (result) {
      if (!result)
        console.log(`error occurred when creating a bundle, please retry.`);

      // zip the bundle folder and place it inside the container folder
      socket.emit("update", { message: `bundling is done, start zipping` });
      console.log(`bundling is done, start zipping`);
      zip(folderToBundle, bundleContainerFolder, EXTENSIONS_DIR);

      socket.emit("bundlingCompleted", { message: `process completed` })
      console.log(`process completed`);
    }, function (err) {
      console.log(`error occurred when creating a bundle, please retry.`);
    });

});

app.get("/downloadOutput", function (req, res) {

  // todo: update output folder name
  var outputPath = path.join(__dirname, "output", "extensions.zip");
  var readStream = fs.createReadStream(outputPath);
  readStream.on("open", function () {
    readStream.pipe(res);
  });

  readStream.on("error", function (err) {
    res.end(err);
  });
});

function getJsapiUrl(urlString, isPortal) {
  var parsedUrl = url.parse(urlString, true, true);

  if (!parsedUrl || !parsedUrl.host) {
    console.log(`url is invalid`);
    process.exit(1);
  }
  var host = parsedUrl.host;

  var webAdapter = isPortal ? "apps/dashboard" : "";
  var jsapiUrl = concatUrlParts([host, webAdapter, EXTENSIONS_DIR, BUNDLE_DIR, JSAPI_DIR]);

  return jsapiUrl;
}

function concatUrlParts(urlParts) {
  var url = "";

  urlParts.map(function (urlPart) {
    urlPart = urlPart.endsWith("/") ? urlPart : urlPart += "/";

    url += urlPart;
  });

  return url;
}

function createBundle(jsapiUrl, sourceFolder, folderToBundle, bundleContainerFolder) {
  var apiFolder = path.join(folderToBundle, JSAPI_DIR);
  var apiFilePaths = [path.join(apiFolder, "init.js"), path.join(apiFolder, "dojo/dojo.js")];
  var regex = new RegExp(/\[HOSTNAME_AND_PATH_TO_JSAPI\]/, "gi");

  return new Promise(function (resolve, reject) {
    // empty the content in the output's container folder without deleting the container itself 
    // the container will be created if it does not existß
    fs.emptydir(bundleContainerFolder, function (err) {
      if (err) {
        console.log(`error occurred when deleting previous output, details: ${err}`);
        reject(false);
      }

      // copy API and extensions to the folder which will be bundled
      fs.copy(sourceFolder, folderToBundle, function (err) {
        if (err) {
          console.log(`error occurred when copying, details: ${err}`);
          reject(false);
        }

        // replace text in the API and extensio files
        apiFilePaths.map(function (path) {
          replaceText(path, regex, jsapiUrl);
        });

        var extensionFiles = getFilePathsRecursive(folderToBundle, apiFolder);
        if (!extensionFiles)
          console.log(`no extension file was found`);
        else {
          extensionFiles.map(function (path) {
            replaceText(path, regex, jsapiUrl);
          });
        }

        resolve(true);
      });
    });
  });
}

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

function zip(folderToZip, containerFolder, outputName) {
  var intervalId;
  var lastZippedSize = -1;
  var zipFilePath = path.join(containerFolder, outputName + ".zip");

  // create the write stream
  var writeStream = fs.createWriteStream(zipFilePath);

  writeStream.on("close", function () {
    clearInterval(intervalId);

    socket.emit("update", { message: `zipping done. ${archive.pointer()} total bytes have been zipped` });
    console.log(`zipping done. ${archive.pointer()} total bytes have been zipped`);
  });

  writeStream.on("error", function () {
    console.error(`error occurred at writeStream. Please try again`);
    return;
  })

  // start zipping 
  var archive = archiver("zip", { level: 9 });

  archive.on("error", function (err) {
    fs.emptyDirSync(containerFolder);
    console.log(`error occurred at arcihve. Please try again`);
  });

  archive.on("entry", function (obj) {
    lastZippedSize = archive.pointer();
  })

  archive.pipe(writeStream);

  var outputStructure = outputName + "/" + path.basename(folderToZip);
  archive.directory(folderToZip, outputStructure);

  archive.finalize();

  // kick off a timer to check if the zip process stops unexpectedly 
  intervalId = setInterval(function () {

    var currentZippedSize = archive.pointer();
    socket.emit("update", { message: `${currentZippedSize} bytes of data have been zipped` });

    if (currentZippedSize > lastZippedSize)
      lastZippedSize = currentZippedSize;
    else {
      socket.emit("update", { message: `error occurred, retrying to zip` });
      console.log(`error occurred, retrying to zip`);
      zip(folderToZip, containerFolder, outputName);
    }
  }.bind(folderToZip, containerFolder, outputName), 2000);
}