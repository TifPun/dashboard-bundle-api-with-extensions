// importing and exporting module: 
// https://www.sitepoint.com/understanding-module-exports-exports-node-js/

var fs = require("fs-extra");
var path = require("path");
var archiver = require("archiver");

var outputContainer = path.join(__dirname, "output");
var retryAttempt = 0;
var clientDisconnects = false;

module.exports = {

  initialize: function(socket){
    this.socket = socket;

    // abort any bundling or zipping process if client disconnects
    this.socket.on("disconnect", function () {
      clientDisconnects = true;
    });
  },

  createBundle: function(extensionsDir, jsapiUrl){
    // create the bundle by copying the source files to the output location, then updating the JSAPI path

    return new Promise(function (resolve, reject) {
      // empty the content in the output's container folder without deleting the container itself 
      // the container will be created if it does not exist
      fs.emptydir(outputContainer, function (err) {
        if (err)
          return reject(false);

        // copy API and extensions from the source folder "data" to the output folder "extensionsDir"
        fs.copy(path.join(__dirname, "data"), extensionsDir, function (err) {

          // delete the bundle if client has disconnected 
          if (clientDisconnects) {
            fs.emptydir(outputContainer, function (err) {
              clientDisconnects = false;
            });
            return reject(false);
          }

          // files do not exist in the source location
          if (err)
            return reject(false);

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
  },

  zip: function(extensionsDir, extensionsZip){
    // zip the bundle folder

    this.extensionsDir = this.extensionsDir || extensionsDir;
    this.extensionsZip = this.extensionsZip || extensionsZip;
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
      fs.accessSync(this.extensionsDir);

      // create the write stream
      let writeStream = fs.createWriteStream(path.join(outputContainer, this.extensionsZip));

      writeStream.on("close", function () {
        clearInterval(intervalId);
        retryAttempt = 0;

        let dataInMB = Math.round(archive.pointer() / 1000000, -1);
        this.socket.emit("update", { message: `zipping done. ${dataInMB} MB of data have been zipped`, serverNotBusy: true, success: true });
      }.bind(this));

      writeStream.on("error", function () {
        fs.emptydir(outputContainer, function (err) {
          this.socket.emit("update", { message: "error occurred during zipping. Please try again", serverNotBusy: true });
        }.bind(this));
        return;
      }.bind(this));

      // start zipping 
      let archive = archiver("zip", { level: 9 });

      archive.on("error", function (err) {
        fs.emptyDirSync(outputContainer);
        this.socket.emit("update", { message: "error occurred during zipping. Please try again", serverNotBusy: true });
        return;
      }.bind(this));

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
      archive.directory(this.extensionsDir, path.basename(this.extensionsDir));

      archive.finalize();

      // recovery mode: kick off a timer to check if the zip process stops unexpectedly
      intervalId = setInterval(function () {

        if (retryAttempt === 3) {
          clearInterval(intervalId);
          this.socket.emit("update", { message: "failed to zip after 3 attempts. Please try again", serverNotBusy: true });
          return;
        }

        let currentZippedSize = archive.pointer();
        this.socket.emit("update", { message: `${currentZippedSize} bytes of data have been zipped` });

        if (currentZippedSize > lastZippedSize)
          lastZippedSize = currentZippedSize;
        else {
          retryAttempt++;
          this.socket.emit("update", { message: "error occurred, retrying to zip", serverNotBusy: false });

          fs.remove(path.join(outputContainer, this.extensionsZip), function (err) {
            this.zip();
          }.bind(this));
        }
      }.bind(this), 2000);
    } catch (err) {
      this.socket.emit("update", { message: "error occurred during zipping. Please try again", serverNotBusy: true });
    }
  }
};

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



