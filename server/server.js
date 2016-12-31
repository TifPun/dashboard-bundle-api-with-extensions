var fs = require("fs-extra");
var path = require("path");
var express = require("express");
var bodyParser = require("body-parser");
var url = require("url");
var app = express();
var bundler = require("./bundler.js");

// The original way of how the app listens to a port doesn't work with Heroku
// (https://github.com/TifPun/dashboard-bundle-api-with-extensions/blob/2a42dcd46085815faeb6c830031c7d70b7f20afe/server/server.js#L11)
// changing the implementation to the following
app.set("port", (process.env.PORT || 5000));
server = app.listen(app.get("port"), function() {
  console.log("App is running on port", app.get("port"));
});

app.use("/", express.static(path.join(__dirname, "../app")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "no-cache");
  next();
});

// config socket.io for the client-server communication
var io = require("socket.io")(server);
var socket;
var clientDisconnects = false;
io.on("connection", function (_socket) {
  clientDisconnects = false;
  socket = _socket;
});

var outputContainer = path.join(__dirname, "output");
var extensionsZip = "extensions.zip";

app.post("/submit", function (req, res) {
  // received a request from client to kick off the bundling

  if (!req.body || !req.body.urlString) {
    let errorMessage = "request contains invalid parameters. Make sure URL is correct";
    res.status(400).send({ message: errorMessage });
    socket.emit("update", { message: errorMessage, serverNotBusy: true });
    return;
  }

  // validate server URL
  let isPortal = (req.body.isPortalSelected === "true");
  let urlString = req.body.urlString.trim();
  let extensionsDirName = isPortal ? "jsapi-bundled" : "opsDashboardExtensions";
  let jsapiUrl = getJsapiUrl(isPortal, urlString, extensionsDirName); 
  if(!jsapiUrl){
    socket.emit("update", { message: "URL is invalid, please retry", serverNotBusy: true });
    res.status(200);
    return;
  }

  let extensionsUrl = url.parse(urlString, true, true).protocol + "//" + path.join(jsapiUrl, "../");
  let extensionsDir = path.join(outputContainer, extensionsDirName)

  socket.emit("update", { message: "started creating extension bundle", serverNotBusy: false });
  res.status(200).send({ message: extensionsUrl });

  // bundle the extension and JSAPI files 
  bundler.initialize(socket);
  bundler.createBundle(extensionsDir, jsapiUrl).then(function (result) {
    if (!result) {
      socket.emit("update", { message: "error occurred when creating a bundle, please retry. result = false", serverNotBusy: true })
      return;
    }

    // zip the bundle 
    socket.emit("update", { message: "bundling is done. start zipping", serverNotBusy: false });
    bundler.zip(extensionsDir, extensionsZip);

  }, function (err) {
    socket.emit("update", { message: "error occurred when creating a bundle, please retry. " + err, serverNotBusy: true });
  });

});

app.get("/downloadOutput", function (req, res) {
  // download the zipped bundle

  let filename = path.join(__dirname, path.basename(outputContainer), extensionsZip);

  // using Express helper function: http://expressjs.com/en/api.html
  res.download(filename); 

  // using the Node.js method to download
  // http://stackoverflow.com/questions/21578208/node-js-send-file-to-client
  // let readStream = fs.createReadStream(filename);
  // readStream.pipe(res);
});

// ***************** Helper functions ***************** 

function getJsapiUrl(isPortal, hostingUrl, extensionsDirName) {
  let parsedUrl = url.parse(hostingUrl, true, true);

  let host = parsedUrl.host;
  let _path = parsedUrl.pathname;
  
  if (!parsedUrl || !parsedUrl.protocol || !host || !_path) {
    return;
  }

  if (isPortal)
    return path.join(host, _path, "apps/dashboard/extensions", extensionsDirName, "arcgis_js_api/");
  else
    return path.join(host, _path, extensionsDirName, "arcgis_js_api/");
}