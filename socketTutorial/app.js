var app = require("express")();
var server = require("http").Server(app);
var io = require("socket.io")(server);  // new socket.io instance attaching to the server
var path = require("path");

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "index.html"), function (err) {
    if (err) {
      console.log(err);
      res.status(err.status).end();
    }
  });
});

var clients = 0;

io.on("connection", function (socket) {
  clients++;

  console.log("a user connected");

  setTimeout(function () {
    // socket.send("send a message 4s after connection");
    // send to whoever subscribed to this event
    socket.emit("testerEvent", {
      description: "server sent a custom event"
    })
  }, 4000);

  // broadcast to all clients
  // io.sockets.emit("broadcast", {
  //   description: clients + " clients connected"
  // });

  // emil to the newly connected client
  socket.emit("newclientconnect", { description: "Welcome new client connection" });

  // broadcast to all clients except the newly connected client
  socket.broadcast.emit("newclientconnect", { description: clients + " clients connected" });

  socket.on("clientEvent", function (data) {
    console.log(data.description);
  });

  socket.on("disconnect", function () {
    clients--;
    socket.broadcast.emit("newclientconnect", { description: clients + " clients connected" });
    console.log("a user disconnected");
  });

});

server.listen(3000, function () {
  console.log("listening on port 3000");
});

// server               client
// socket.send("message")      socket.on("message", function(message){})
// socket.emit("event1", {})  socket.on("event1", function(data){})
