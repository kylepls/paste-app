var database;

module.exports = function(db) {
  database = db;
  return exports;
}

exports.handle = function(req, res) {
  var id = req.params.id;
  database.getPaste(id, req, res).then(function(paste) {
    console.log('paste', JSON.stringify(paste, null, 2))
    res.render('view', { paste: paste });
  });
}