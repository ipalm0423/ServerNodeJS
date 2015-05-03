var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/db');
//read error
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongodb connection error:'));
db.once('open', function (callback) {
console.log('open Mongodb');
});

exports.mongoose = mongoose;
