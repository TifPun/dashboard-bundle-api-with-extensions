var fs = require('fs-extra');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var archiver = require("archiver");
var app = express();

app.set('port', (process.env.PORT || 3000));
app.use('/', express.static(path.join(__dirname, '../app')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-cache');
  next();
});

app.listen(app.get('port'), function () {
  console.log('Server started: http://localhost:' + app.get('port') + '/');
});

app.post('/submit', function (req, res) {
  var url = req.body.url.trim();

  var serverDomain = getServerDomain(url);

  createBundle(serverDomain);

  res.json({
    url: serverDomain
  });
});

function createServerUrl(url) {

}

function getServerDomain(url) {
  var domain = url.split("//")[1];
  if (!domain) {
    console.log("server domain cannot be determined");
    process.exit(1);
  }

  domain = domain.endsWith("/") ? domain : domain += "/";

  console.log("server domain is now " + domain);

  return domain;
};

function createBundle(serverDomain) {
  console.log("bundling begins");

  var sourceFolder = path.join(__dirname, "data");
  var outputContainer = path.join(__dirname, "output");
  var folderToBundle = path.join(outputContainer, "jsapi-bundled");
  var apiFolder = path.join(folderToBundle, "arcgis_js_api");
  var apiFilePaths = [path.join(apiFolder, "init.js"), path.join(apiFolder, "dojo/dojo.js")];
  var regex = new RegExp(/\[HOSTNAME_AND_PATH_TO_JSAPI\]/, "gi");
  var outputName = "extensions";

  // empty the content in the output folder without deleting the folder itself 
  // the folder (and parent folder) will be created if not exists
  fs.emptyDirSync(outputContainer);

  console.log("dir emptied, copying begins");

  // copy API and extensions to the output folder
  fs.copy(sourceFolder, folderToBundle, function (err) {
    if (err) {
      console.log(err);
      return;
    }

    // replace text in files in the API
    apiFilePaths.map(function (path) {
      replaceText(path, regex, serverDomain);
    });

    // replace text in files in extensions
    var extensionFiles = getExtensionFiles(folderToBundle, apiFolder);
    if (!extensionFiles) {
      console.log("no extension file was found");
      return;
    }

    extensionFiles.map(function (path) {
      replaceText(path, regex, serverDomain);
    });

    console.log("finished replacing, zipping begins");

    // zip output folder
    zipOutput(folderToBundle, outputContainer, outputName);
  });
}

function getExtensionFiles(folderToBundle, excludeFolder, extensionFiles) {
  extensionFiles = extensionFiles || [];

  var subFolder = fs.readdirSync(folderToBundle, "utf8");
  subFolder.map(function (subFolder) {
    var subFolderPath = path.join(folderToBundle, subFolder);

    if (subFolderPath.startsWith(excludeFolder))
      return;

    if (fs.statSync(subFolderPath).isDirectory())
      getExtensionFiles(subFolderPath, excludeFolder, extensionFiles);
    else
      extensionFiles.push(subFolderPath);
  });

  return extensionFiles;
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

function zipOutput(folderToBundle, container, outputName) {
  var archive = archiver('zip');

  var outputStructure = outputName + "/" + path.basename(folderToBundle);
  console.log("outputStructure " + outputStructure);

  var output = fs.createWriteStream(path.join(container, outputName + ".zip"));

  output.on("close", function () {
    console.log(archive.pointer() + " total bytes have been zipped");
  });

  archive.on("error", function (err) {
    console.log("error occurred. Details " + err);
  });

  archive.pipe(output);

  archive.directory(folderToBundle, outputStructure);

  archive.finalize(function (err, bytes) {
    if (err) throw err;
  });
}

// app.post('/api/comments', function(req, res) {
//   fs.readFile(COMMENTS_FILE, function(err, data) {
//     if (err) {
//       console.error(err);
//       process.exit(1);
//     }
//     var comments = JSON.parse(data);
//     var newComment = {
//       id: Date.now(),
//       author: req.body.author,
//       text: req.body.text,
//     };
//     comments.push(newComment);
//     fs.writeFile(COMMENTS_FILE, JSON.stringify(comments, null, 4), function(err) {
//       if (err) {
//         console.error(err);
//         process.exit(1);
//       }
//       res.json(comments);
//     });
//   });
// });