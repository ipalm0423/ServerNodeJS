
var mongodb = require('./mongodb.js');
var currentUid = 3
var Schema = mongodb.mongoose.Schema;
var UserSchema = new Schema({
  name: String,
  picture: Buffer,
  account: String,
  password: String,
  pttAC: String,
  pttPW: String,
  uid: String,
  //sid: String,
  favorList: [String],
  unRead: [Schema.Types.Mixed],
  lastOnline: {type: Date, default: Date.now},
  _id: Schema.Types.ObjectId
});
var User = mongodb.mongoose.model('Users', UserSchema);
var UserDAO = function() {};
module.exports = new UserDAO();

//add User
UserDAO.prototype.add = function (callback) {
  currentUid += 1;
  var id = new mongodb.mongoose.Types.ObjectId;
  var json = {'uid': currentUid, '_id': id};
  var object = new User(json);
  object.save(function(err, obj) {
    callback(err, obj);
    console.log('建立新用戶' + id);
  });
};

//find User
UserDAO.prototype.findByUid = function (uid, callback) {
  User.findOne({uid: uid}, function(err, obj) {
    callback(err, obj);
  });
};

//find User by account
UserDAO.prototype.findByAC = function (AC, PW, callback) {
  User.findOne({account: AC, password: PW}, function(err, obj) {
    callback(err, obj);
  });
};

//find User by PTT account
UserDAO.prototype.findBypttAC = function (AC, PW, callback) {
  User.findOne({pttAC: AC, pttPW: PW}, function(err, obj) {
    callback(err, obj);
  });
};

//create Users account
UserDAO.prototype.createAC = function (json, callback) {
  var uid = json.uid;
  var AC = json.account;
  var PW = json.password;
  //check AC if already exist?
  User.findOne({account: AC}, function(err, obj) {
    if (obj != null) {
      //already regist
      callback('此帳號已註冊', obj)
    }else {
      //check ptt if already exist
      //load ptt user data

      //no one regist
      User.findOneAndUpdate({uid: uid}, { $set: json}, function(err, obj) {
        console.log(uid + ' 註冊成功');
        callback(err, obj);
      });

    }
  });
};

//update User
UserDAO.prototype.updateByJSON = function (json, callback) {
  var uid = json.uid;
  User.findOneAndUpdate({uid: uid}, { $set: json}, function(err, obj) {
    callback(err, obj);
    console.log(uid + '更新成功');
  });
};

//delete User
UserDAO.prototype.deleteByUid = function (uid, callback) {
  User.findOneAndRemove({uid: uid}, function(err) {
    callback(err);
    console.log(uid + '已刪除');
  })
};

UserDAO.prototype.loadUnRead = function (uid, callback) {
  User.findOne({uid: uid}, function(err, obj) {
    var array = obj.unRead;
    callback(err, array);
  });
};
