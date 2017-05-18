var database;

module.exports = function(db) {
  database = db;
  return exports;
}

exports.handle = function(req, res) {
  var id = req.params.id;
  database.getPaste(id, req, res).then(function(paste) {
    res.send('<pre>' + paste.content + '</pre>');
  });
}