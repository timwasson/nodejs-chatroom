var socket = io();
      
var person; // = prompt("Please enter your name", "Harry Potter");

$('form#user').submit(function() {
  if($("form#user input").val() != "") {
    $("#username").fadeOut();
    person = $("form#user input").val();
  } else {
    // Put up an error.
  }
  return false;
});

$('form#chat').submit(function() {
  if($('#m').val() != "") {
    socket.emit('chat message', [person,$('#m').val()]);
  }
  return false;
});
$("#m").keyup(function() {
  socket.emit('is typing', person + " typing...");
  return false;
});
socket.on('chat message', function(msg) {
  
  $("#messages ul").append($("<li>").html("<span>" + msg[0] + "</span>: " + msg[1]));
  
  $("#messages").scrollTop($("#messages ul").height());
  
  console.log($("#messages ul").height());
  $("#m").val("");
});
socket.on('disconnect', function(msg) {
  $("#messages").append($("<li><span>A user disconnected</span></li>"));
});
socket.on('is typing', function(msg) {
  $("#typing").html(msg);
  setTimeout(function() { $("#typing").html(""); }, 500);
});
socket.on('connect', function(msg) {
  $("#messages ul").append("<li class=\"info\">A user connected</li>");
});

// Audio Player Functionality
var audioEl = $("#ep_audio");
var playButton = $(".play");
var pauseButton = $(".pause");


// Hide the pause initially
pauseButton.hide();

// Hit the pause button
pauseButton.on("click", function() {
  audioEl[0].pause();
  playButton.show();
  pauseButton.hide();
});

// Hit the Play button
playButton.on("click", function() {
  audioEl[0].play();
  playButton.hide();
  pauseButton.show();
});

// Function to get the current track/song
function getCurrent() {
  $.ajax({
    url: "/now-playing",
    format: "jsonp",
    cache: false
  })
  .done(function( html ) {
    var feed = jQuery.parseJSON(html);
    console.log(feed);
    //console.log(feed["Current Song:"]);
    $(".now-playing").text(feed);
  });
}
// Fire it once to set the thing, then every 10 seconds.
getCurrent();

setInterval(function(){ getCurrent() }, 10000);