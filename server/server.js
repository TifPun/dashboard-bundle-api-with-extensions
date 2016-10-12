var fs = require("fs-extra");
var path = require("path");
var express = require("express");
var bodyParser = require("body-parser");
var archiver = require("archiver");
var url = require("url");
var app = express();

var EXTENSIONS_DIR = "extensions";
var BUNDLE_DIR = "jsapi-bundled";
var JSAPI_DIR = "arcgis_js_api";

app.set("port", (process.env.PORT || 3000));
app.use("/", express.static(path.join(__dirname, "../app")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "no-cache");
  next();
});

app.listen(app.get("port"), function () {
  console.log("Server started: http://localhost:" + app.get("port") + "/");
});

app.post("/submit", function (req, res) {

  var sourceFolder = path.join(__dirname, "data");
  var bundleContainerFolder = path.join(__dirname, "output");
  var folderToBundle = path.join(bundleContainerFolder, BUNDLE_DIR);

  var urlString = req.body.url.trim();
  var isPortal = req.body.isPortalSelected;
  console.log("request: " + urlString + ", " + isPortal)

  var jsapiUrl = getJsapiUrl(urlString, isPortal);

  console.log("bundling begins, JSAPI url " + jsapiUrl);
  createBundle(jsapiUrl, sourceFolder, folderToBundle, bundleContainerFolder);

  // zip the bundle folder and place it inside the container folder
  console.log("finished replacing, zipping begins");
  zip(folderToBundle, bundleContainerFolder, EXTENSIONS_DIR);

  res.json({
    url: jsapiUrl
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
    console.log("url is invalid");
    process.exit(1);
  }
  var host = parsedUrl.host;
  console.log("host is: " + host);

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

  try {
    // empty the content in the output's container folder without deleting the container itself 
    // the container will be created if it does not exist
    fs.emptyDirSync(bundleContainerFolder);

    console.log("dir emptied, copying begins");

    // copy API and extensions to the folder which will be bundled
    fs.copySync(sourceFolder, folderToBundle);

    // replace text in files in the API
    apiFilePaths.map(function (path) {
      replaceText(path, regex, jsapiUrl);
    });

    // replace text in files in extensions
    var extensionFiles = getFilePathsRecursive(folderToBundle, apiFolder);
    if (!extensionFiles) {
      console.log("no extension file was found");
      return;
    }

    extensionFiles.map(function (path) {
      replaceText(path, regex, jsapiUrl);
    });

  } catch (err) {
    console.log(err);
  }
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
      console.log("error reading " + path + ". Details: " + err);
      return;
    }

    // var updatedData = data.replace(/\[HOSTNAME_AND_PATH_TO_JSAPI\]/gi, newText);
    var updatedData = data.replace(regex, newText);
    fs.writeFile(path, updatedData, "utf8", function (err) {
      if (err)
        console.log("error writing into " + path + ". Details: " + err);
    });
  });
}

function zip(folderToZip, containerFolder, outputName) {
  console.log("start  zipping");
  var lastZippedSize;
  var zipFilePath = path.join(containerFolder, outputName + ".zip");

  if (fileExists(zipFilePath)) {
    console.log("zip folder exists. deleting");
    fs.removeSync(zipFilePath);
  }

  var writeStream = fs.createWriteStream(zipFilePath);
  // var zippingIsDone = false;

  writeStream.on("close", function () {
    // zippingIsDone = true;
    console.log(archive.pointer() + " total bytes have been zipped");
  });

  writeStream.on("error", function () {
    console.error("error occurred at writeStream");
    fs.close();
  })

  var archive = archiver("zip", { level: 9 });

  archive.on("error", function (err) {
    console.log("error occurred at arcihve. Details " + err);
    fs.close();
  });

  archive.on("entry", function (obj) {
    lastZippedSize = archive.pointer();
    // console.log(archive.pointer() + " bytes zipped");
  })

  archive.pipe(writeStream);

  var outputStructure = outputName + "/" + path.basename(folderToZip);
  console.log("outputStructure " + outputStructure);
  archive.directory(folderToZip, outputStructure);

  archive.finalize();

  setTimeout(function (folderToZip, containerFolder, outputName) {
    // if(zippingIsDone)
    //   return;

    console.log("folders: " + folderToZip + ", " + containerFolder + ", " + outputName);
    
    var currentZippedSize = archive.pointer();
    if (currentZippedSize > lastZippedSize) {
      lastZippedSize = currentZippedSize;
      console.log("========== currentZippedSize is now " + currentZippedSize);
    }
    else {
      console.log("========== no update, will zip again ");
      try {
        fs.closeSync();
      } catch (err) {
        console.log("========== error happens when closing fs");
      }
      zip(folderToZip, containerFolder, outputName);
    }
  }, 2000);
}

function fileExists(file) {
  try {
    fs.accessSync(file);
    return true;
  } catch (err) {
    return false;
  }
}