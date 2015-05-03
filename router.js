var handler = require('./requestHandler');
var users = require('./users');

function route(io) {

  //online
  io.sockets.on("connection", function(socket) {

    var address = socket.handshake.address;
    var ip = address.address;
    var port = address.port;
    console.log("New connection from " + address.address + ":" + address.port);
    socket.emit('message', {'message': 'log in success'});

    //new create user
    socket.on('updateuser', function(data) {
    console.log('update user from: ' + address.address);
    handler.updateuser(data, socket);
    });

    //login user
    socket.on('login', function(data) {
    console.log('log in from: ' + address.address);
    handler.login(data, socket);
    });

    //create account
    socket.on('createAC', function(data) {
    console.log('create account from: ' + address.address);
    handler.createAC(data, socket);
    });

    //online user
    socket.on('online', function(data) {
    console.log('online request from: ' + address.address);
    handler.online(data, socket);
    });

    //new chat room
    socket.on('newchat', function(data) {
    console.log('new chat request from: ' + address.address);
    handler.newchat(data, socket);
    });

    //send message
    socket.on('message', function(data) {
    console.log('message request from: ' + address.address);
    handler.message(data, socket);
    });

    //update board
    socket.on('board', function(data) {
    console.log('board request from: ' + address.address);
    handler.board(data, socket);
    });

    //update news
    socket.on('updatenews', function(data) {
    console.log('updatenews from: ' + address.address);
    handler.updatenews(data, socket);
    });

    //socket disconnect
    socket.on('disconnect', function () {
    // remove the username from users online array
    console.log('disconnect from: ' + address.address);
    handler.offline(socket);
    });
  });

  /*
  console.log("About to route a request for " + pathname);
  if (typeof handle[pathname] === 'function') {
    return handle[pathname](response, postData);
  } else {
    console.log("No request handler found for " + pathname);
    response.writeHead(404, {"Content-Type": "text/plain"});
    response.write("404 Not found");
    response.end();
  }*/
}

exports.route = route;
