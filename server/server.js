var fs = require('fs-extra');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
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

var getServerDomain = function (url) {
  var domain = url.split("//")[1];
  if (!domain) {
    console.log("server domain cannot be determined");
    process.exit(1);
  }

  if (!domain.endsWith("/"))
    domain += "/";

  console.log("server domain is now " + domain);

  return domain;
};

var createBundle = function (serverDomain) {
  console.log("starting to bundle");

  var sourceFolder = path.join(__dirname, "data");
  var outputFolder = path.join(__dirname, "output/extensions/jsapi-bundled");
  var outputFolderApi = path.join(outputFolder, "arcgis_js_api");
  var outputApiFilePaths = [path.join(outputFolderApi, "init.js"), path.join(outputFolderApi, "dojo/dojo.js")];

  // delete contents in the output folder. If the output folder doesn't exist, it will be created
  fs.emptyDirSync(outputFolder);

  console.log("dir created. Copying begins");

  // copy API and extensions to the output folder
  fs.copy(sourceFolder, outputFolder, function (err) {
    if (err) {
      console.log(err);
      return;
    }

    // replace text in files in the API
    outputApiFilePaths.map(function (path) {
      replaceText(path, serverDomain);
    });

    // replace text in files in extensions
    var extensionFiles = getExtensionFiles(outputFolder, outputFolderApi);
    if (!extensionFiles) {
      console.log("no extension file was found");
      return;
    }

    extensionFiles.map(function (path) {
      replaceText(path, serverDomain);
    });

    // zip output folder

    // send download link in the output 
  });
}

function getExtensionFiles(folder, outputFolderApi, extensionFiles) {
  extensionFiles = extensionFiles || [];

  var dirs = fs.readdirSync(folder, "utf8");
  dirs.map(function (dir) {
    var contentPath = path.join(folder, dir);

    if (contentPath.startsWith(outputFolderApi))
      return;

    if (fs.statSync(contentPath).isDirectory())
      getExtensionFiles(contentPath, outputFolderApi, extensionFiles);
    else
      extensionFiles.push(contentPath);
  });

  return extensionFiles;
}

function replaceText(path, serverDomain) {
  fs.readFile(path, "utf8", function (err, data) {
    console.log("replacing " + path);
    if (err) {
      console.log("error reading " + path + ". Details: " + err);
      return;
    }

    var updatedData = data.replace(/\[HOSTNAME_AND_PATH_TO_JSAPI\]/gi, serverDomain);
    fs.writeFile(path, updatedData, "utf8", function (err) {
      if (err)
        console.log("error writing into " + path + ". Details: " + err);
    });
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