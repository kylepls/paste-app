var Db = require('mongodb').Db,
      Server = require('mongodb').Server,
      ObjectID = require('mongodb').ObjectID;
var assert = require('assert');
var Promise = require('promise');
var config = require('../config/mongo');

var db = new Db(config.data, new Server(config.host, config.port));

var pastes;
var sequence;

db.open(function(err, db) {
  assert.equal(null, err);
  console.log('Connected to mongodb');
  db.authenticate(config.user, config.pass, function(err, res) {
    if (err) throw err;
    console.log('Authenticated to mongodb')
    pastes = db.collection(config.data);
  });
});

exports.getPaste = function(id, req, res) {
  return new Promise(function(fulfill, reject) {
    pastes.findOne({ _id: id }, function(err, rec) {
      if (err || !rec) {
        res.render('failed');
      } else {
        fulfill(rec);
      }
    });
  });
};

/*
exports.updatePoll = function(poll) {
  pastes.updateOne({ _id: poll._id }, {
    $set: { "options": poll.options, "votes": poll.votes }
  }, function(err, res) {
    if (err) console.error(err);
  });
}
*/

exports.insertDocument = function(content) {
  return new Promise(function(fulfill, reject) {
    pastes.insert(content, {w: 1}, function(err, result) {
      if (err) reject(err);
      else fulfill(sequence);
    });
  });
}