var fs = require("fs-extra");
var path = require("path");
var express = require("express");
var bodyParser = require("body-parser");
var url = require("url");
var app = express();
var server = require("http").Server(app);
var io = require("socket.io")(server);
var bundler = require("./bundler.js");

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

var socket;
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
  let jsapiUrl = getJsapiUrl(isPortal, urlString, extensionsDirName); 
  let extensionsUrl = url.parse(urlString, true, true).protocol + "//" + path.join(jsapiUrl, "../");
  let extensionsDir = path.join(outputContainer, extensionsDirName)

  socket.emit("update", { message: "started creating extension bundle", serverNotBusy: false });
  res.status(200).send({ message: extensionsUrl });

  // bundle the extension and JSAPI files 
  bundler.createBundle(extensionsDir, jsapiUrl).then(function (result) {
    if (!result) {
      socket.emit("update", { message: "error occurred when creating a bundle, please retry", serverNotBusy: true })
      return;
    }

    socket.emit("update", { message: "bundling is done. start zipping", serverNotBusy: false });
    bundler.zip(extensionsDir, extensionsZip);

  }, function (err) {
    socket.emit("update", { message: "error occurred when creating a bundle, please retry", serverNotBusy: true });
  });

});

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