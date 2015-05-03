var exec = require('child_process').exec;
var users = require('./users.js');

function updateuser(data, socket) {
  var jsontemp = JSON.parse(data);
  users.updateByJSON(jsontemp, function(err, obj) {
    if (err) {
      //update fail
      console.log('update fail' + err);
      socket.emit("push", err);
    }else {
      //update to client
      socket.emit('push', 'updateuser ok');
      console.log(obj);
    }
  });
}

function login(data, socket) {
  var jsontemp = JSON.parse(data);
  var type = jsontemp.types;
  var AC = jsontemp.account;
  var PW = jsontemp.password;
  if (type == 'ptt') {
    users.findBypttAC(AC, PW, function(err, obj) {
      if (obj == null) {
        console.log(err);
        //load ptt data into server
        console.log('not exist in server, looking for ptt');


        //if ptt have no user account
        socket.emit('push', "帳號密碼有誤，請重新確認");
        console.log('帳號密碼有誤');
      }else {
        socket.emit('updateuser', obj);
        console.log(obj);
        console.log('update user with account');
      }
    });
  }else if (type == 'normal') {
    users.findByAC(AC, PW, function(err, obj) {
      if (obj == null) {
        console.log(err);
        console.log('帳號密碼有誤');
        socket.emit('push', "帳號密碼有誤，請重新確認");
      }else {
        socket.emit('updateuser', obj);
        console.log(obj);
        console.log('update user with account');
      }
    });
  }
}

function createAC(data, socket) {
  var jsontemp = JSON.parse(data);
  users.createAC(jsontemp, function(err, obj) {
    if (err) {
      //create fail
      console.log('update fail' + err);
      socket.emit("push", err);
    }else {
      //update to client
      socket.emit('push', 'create account ok');

    }
  });
}

function online(data, socket) {
  var jsontemp = JSON.parse(data);
  var uid = jsontemp.uid;
  //check if new user
  if (isEmpty(uid)) {
    // create new uid
    console.log('client have no uid');
    users.add(function(err, obj) {
      if (err) {
        console.log('fail' + err);
      }else {
        //create new user
        console.log('create new id: ' + obj.uid);
        //update to client
        socket.emit('updateuser', {'uid': obj.uid});
        //add to online array
        if (addOnlineUser(obj.uid, socket)) {
          socket.emit('online', {'online': 'ok'});
        }
      };
    });
  }else {
    //add user to online array
    if (addOnlineUser(uid, socket)) {
      socket.emit('online', {'online': 'ok'});
    }
    //update unRead
    updatenewsByUid(uid, socket);
  }

}

function newchat(data, socket) {
  jsontemp = JSON.parse(data);
}

function message(data, socket) {
  jsontemp = JSON.parse(data);
}

function board(data, socket) {
  jsontemp = JSON.parse(data);
}

function updatenewsByUid(uid, socket) {
  //update news
  users.loadUnRead(uid, function(err, array) {
    if (err) {
      console.log('fail' + err);
    }else if (isEmpty(array) === false) {
      //send unRead to user
      socket.emit('updatenews', array);
    }else {
      console.log('uid: ' + uid + ' have no unRead');
    }
  });
}

function updatenews(data, socket) {
  var jsontemp = JSON.parse(data);
  var uid = jsontemp.uid;
  //update news
  updatenewsByUid(uid, socket);
}

function offline(socket) {
  for (var i = 0; i < onlineUsers.length; i++) {
    if (onlineUsers[i].socket == socket) {
      //if already online, update socket
      var offlineuid = onlineUsers[i].uid
      onlineUsers.splice(i, 1);
      console.log('uid ' +offlineuid + ' is offline');
      console.log(onlineUsers);
      return;
    }
  }
}

//unwrap Object
var hasOwnProperty = Object.prototype.hasOwnProperty;
function isEmpty(obj) {

    // null and undefined are "empty"
    if (obj == null) return true;

    // Assume if it has a length property with a non-zero value
    // that that property is correct.
    if (obj.length > 0)    return false;
    if (obj.length === 0)  return true;

    // Otherwise, does it have any properties of its own?
    // Note that this doesn't handle
    // toString and valueOf enumeration bugs in IE < 9
    for (var key in obj) {
        if (hasOwnProperty.call(obj, key)) return false;
    }

    return true;
}

//online array
var onlineUsers = [];
function addOnlineUser(uid, socket) {
  //check user if already online?
  for (var i = 0; i < onlineUsers.length; i++) {
    if (onlineUsers[i].uid == uid) {
      //if already online, update socket
      onlineUsers[i].socket = socket;
      console.log('uid ' +uid + ' is online');
      console.log(onlineUsers);
      return true;
    }
  }
  //not in array, add user to online array
  onlineUsers.push({'uid': uid, 'socket': socket});
  console.log('uid: ' +uid + ' is online');
  console.log(onlineUsers);
  return true;
}

exports.online = online;
exports.login = login;
exports.createAC = createAC;
exports.updateuser = updateuser;
exports.newchat = newchat;
exports.message = message;
exports.board = board;
exports.updatenews = updatenews;
exports.offline = offline;
