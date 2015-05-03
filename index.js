var server = require('./server.js');
var router = require('./router.js');

server.startServer(router.route);
