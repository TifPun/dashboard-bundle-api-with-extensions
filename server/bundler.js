// importing and exporting module: 
// https://www.sitepoint.com/understanding-module-exports-exports-node-js/

var fs = require("fs-extra");
var path = require("path");
var archiver = require("archiver");

var outputContainer = path.join(__dirname, "output");
var retryAttempt = 0;
var clientDisconnects = false;
var socket;
var extensionsDir;
var extensionsZip;

module.exports = {

  initialize: function(_socket){
    socket = _socket;

    // abort any bundling or zipping process if client disconnects
    socket.on("disconnect", function () {
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

    let intervalId;
    let lastZippedSize = -1;
    var archive = archiver("zip", { level: 9 });

    // if zipping hasn't started when the client disconnects, delete the bundle
    if (clientDisconnects) {
      clearInterval(intervalId);

      archive.abort();    
      fs.removeSync(outputContainer);
      clientDisconnects = false;
    }

    try {
      fs.accessSync(extensionsDir);

      // create the write stream
      let writeStream = fs.createWriteStream(path.join(outputContainer, extensionsZip));

      writeStream.on("close", function () {
        clearInterval(intervalId);

        if(retryAttempt === 3){
          // stream is closed on an error condition. Do not show the completion message
          retryAttempt = 0;
          return;
        }

        // zipping is done, show the completion message
        let dataInMB = Math.round(archive.pointer() / 1000000, -1);
        socket.emit("update", { message: "zipping done. " + dataInMB + " MB of data have been zipped", serverNotBusy: true, success: true });
      });

      writeStream.on("error", function () {
        archive.abort();    
        fs.removeSync(outputContainer);
        socket.emit("update", { message: "error occurred during zipping. Please try again", serverNotBusy: true });
        return;
      });

      archive.on("entry", function (obj) {
        // if zipping has started when the client disconnects, abort the zipping
        if (clientDisconnects) {
          // archive.unpipe(writeStream);
          // writeStream.end();
          clearInterval(intervalId);
          
          archive.abort();    
          fs.removeSync(outputContainer);
          clientDisconnects = false;
        }

        lastZippedSize = archive.pointer();
        // console.log("entry, size: " + lastZippedSize);
      })

      // start zipping 
      archive.pipe(writeStream);

      // folder structure inside the .zip file 
      archive.directory(extensionsDir, path.basename(extensionsDir));

      archive.finalize();

      // kick off a timer to check if the zip process stops unexpectedly
      intervalId = setInterval(function () {

        if (retryAttempt === 3) {
          // cancel the zipping process after 3 attempts
          
          archive.abort();     
          fs.removeSync(outputContainer);
          clearInterval(intervalId);

          socket.emit("update", { message: "failed to zip after " + retryAttempt + " attempts. Please try again", serverNotBusy: true }); 
        }
        else if (archive.pointer() > lastZippedSize){
          // update the client with the progress 

          lastZippedSize = archive.pointer();
          socket.emit("update", { message: archive.pointer() + "bytes of data have been zipped" });
        }
        else {
          // the size of the zip file didn't change after 2 seconds, remove the file and redo the zipping

          archive.abort();
          fs.removeSync(path.join(outputContainer, extensionsZip));
          clearInterval(intervalId);

          socket.emit("update", { message: "error occurred, retrying to zip", serverNotBusy: false });
          retryAttempt++;

          this.zip(extensionsDir, extensionsZip);
        }

      }.bind(this), 2000);
    } catch (err) {
      socket.emit("update", { message: "error occurred during zipping. Please try again", serverNotBusy: true });
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