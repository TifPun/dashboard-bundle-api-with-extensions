var fs = require("fs-extra");
var path = require("path");
var express = require("express");
var bodyParser = require("body-parser");
var archiver = require("archiver");
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
  var url = req.body.url.trim();
  var isPortal = req.body.isPortalSelected;
  console.log("request: " + url + ", " + isPortal)

  var jsapiUrl = getJsapiUrl(url, isPortal);

  createBundle(jsapiUrl);

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

function getJsapiUrl(url, isPortal) {
  var domain = url.split("//")[1];

  console.log("domain is: " + domain);
  if (!domain) {
    console.log("server domain cannot be determined");
    process.exit(1);
  }

  var webAdapter = isPortal ? "apps/dashboard" : "";
  var jsapiUrl = concatUrlParts([domain, webAdapter, EXTENSIONS_DIR, BUNDLE_DIR, JSAPI_DIR]);

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

function createBundle(jsapiUrl) {
  console.log("bundling begins, JSAPI url " + jsapiUrl);

  var sourceFolder = path.join(__dirname, "data");
  var bundleContainerFolder = path.join(__dirname, "output");
  var folderToBundle = path.join(bundleContainerFolder, "jsapi-bundled");
  var apiFolder = path.join(folderToBundle, "arcgis_js_api");
  var apiFilePaths = [path.join(apiFolder, "init.js"), path.join(apiFolder, "dojo/dojo.js")];
  var regex = new RegExp(/\[HOSTNAME_AND_PATH_TO_JSAPI\]/, "gi");
  var outputName = "extensions";

  // empty the content in the output's container folder without deleting the container itself 
  // the container will be created if it does not exist
  fs.emptyDirSync(bundleContainerFolder);

  console.log("dir emptied, copying begins");

  // copy API and extensions to the folder which will be bundled
  fs.copy(sourceFolder, folderToBundle, function (err) {
    if (err) {
      console.log(err);
      return;
    }

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

    console.log("finished replacing, zipping begins");

    // zip the bundle folder and place it inside the container folder
    zipFolder(folderToBundle, bundleContainerFolder, outputName);
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

function zipFolder(folderToZip, containerFolder, outputName) {
  var archive = archiver("zip");

  var outputStructure = outputName + "/" + path.basename(folderToZip);
  console.log("outputStructure " + outputStructure);

  var output = fs.createWriteStream(path.join(containerFolder, outputName + ".zip"));

  output.on("close", function () {
    console.log(archive.pointer() + " total bytes have been zipped");
  });

  archive.on("error", function (err) {
    console.log("error occurred. Details " + err);
  });

  archive.pipe(output);

  archive.directory(folderToZip, outputStructure);

  archive.finalize(function (err, bytes) {
    if (err) throw err;
  });
}