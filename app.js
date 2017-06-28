var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var join = require('path').join;

var port = process.env.PORT || 8080;

app.use(express.static(join(__dirname, 'public')));

app.get('/', function(req, res){
  res.sendfile('index.html');
});

users = [];


io.on('connection', function(socket){
  console.log('A user connected');
  socket.on('setUsername', function(data){
    console.log(data);

    if(users.indexOf(data) > -1){
      socket.emit('userExists', data + ' username is taken! Try some other username.');
    }
    else{
      users.push(data);
      socket.emit('userSet', {username: data});
  	  socket.emit('onlineUsers', { username: users });
    }
  });

  socket.emit('onlineUsers', { username: users });

  socket.on('msg', function(data){
      //Send message to everyone
      io.sockets.emit('newmsg', data);
  })

});


http.listen(port, function(){
  console.log('listening on localhost:' + port);
});