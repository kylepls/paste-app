var database;

module.exports = function(db) {
  database = db;
  return exports;
}

exports.handle = function(req, res) {
  
  if (req.params.id) {
    database.getPaste(req.params.id, req, res).then(function(paste) {
      res.render('index', { paste: paste });
    });
  } else {
    res.render('index', { paste: { content: '' } });
  }
};