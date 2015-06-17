var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var rootDir = __dirname;

app.get("/", function(req, res) {
  res.sendFile(rootDir + '/index.html');
});

io.on('connection', function(socket) {
  console.log('a user connected');
  socket.on('disconnect', function(msg) {
    console.log('user disconnected' + msg);
    io.emit('disconnect', msg)
  });
  socket.on('chat message', function(msg) {
    console.log(msg[0] + ": " + msg[1]);
    io.emit('chat message', msg);
  });
  socket.on('is typing', function(msg) {
    io.emit('is typing', msg);
    console.log(msg);
  });
});

http.listen(3000, function() {
  console.log('listening on *:3000');
});