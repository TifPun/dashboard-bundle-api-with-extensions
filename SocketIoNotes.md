## Ways that server and client communicate

### Client connects to/disconnects from server 

- Fired on server side 
  - When client connects: `io.on("connection", function(socket){ })`
  - When client disconnects: `socket.on("disconnect", function(){ })` 

### Message sent from server to client

- Sender: `socket.send("textData")` 
- Receiver: `socket.on("message", function(textData){ console.log(textData) }`

### Events

- Send to whoever subscribed to the event (sender can be server or client)
  - Sender: `socket.emit("eventFoo", { myMessage: "MessageContent"} )`
  - Receiver: `socket.on("eventFoo", function(data){ console.log(data.myMessage) })`

- Broadcast from server to all clients 
  - Sender: `io.sockets.emit("eventFoo", { myMessage: "MessageContent" } )`
  - Receiver: `socket.on("eventFoo", function(data){ console.log(data.myMessage) } )`

- Broadcast to all clients except for the last-connected client
  - Sender: `socket.broadcast.emit("eventFoo", { myMessage: "MessageContent" })`
  - Receiver: `socket.on("eventFoo", function(data){ console.log(data.myMessage) } )`


