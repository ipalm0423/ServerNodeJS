var httpModule = require("http");
//var url = require('url');
var socketIO = require('socket.io');


function startServer(route) {
  /*
  //html router
  function onRequest(request, response) {

    var postData = "";
    var path = url.parse(request.url).pathname;
    console.log('requset for' + path);

    request.setEncoding("utf8");

    request.addListener("data", function(postDataChunk) {
      postData += postDataChunk;
      console.log("Received POST data chunk '"+
      postDataChunk + "'.");
    });

    request.addListener("end", function() {
      route(handle, path, response, postData);
    });
  }
  */

  //server start with socket.io
  var server = httpModule.createServer().listen(8900);
  var io = socketIO(server);
  console.log('server start');

  //router
  route(io);


}

exports.startServer = startServer;
