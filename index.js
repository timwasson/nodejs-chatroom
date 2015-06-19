var express = require('express');

var app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);
var cheerio = require('cheerio');
var request = require('request');

var rootDir = __dirname;

app.use(express.static(__dirname + '/static'));

app.get("/now-playing", function(req, res) {
  // Get the current song / episode
  url = 'http://radio.atomicast.com:8000/';
  var song;

  request(url, function(error, response, html){
    if(!error){
      var $ = cheerio.load(html);
      
      // Grab the current song / episode
      song = $(".newscontent tr:last-child td.streamdata").text();
      //console.log(song);
      
      res.end(JSON.stringify(song));
    }
  });
});

app.get("/", function(req, res) {
  res.sendFile(rootDir + '/index.html');
  console.log('Go fuck yourself, TJW');
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