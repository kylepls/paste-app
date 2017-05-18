var validator = require('validator');
var database;
var characters = '0123456789abcdefghijklmnopqrstuvwxyz';

module.exports = function(db) {
  database = db;
  return exports;
}

function createKey() {
  var string = '';
  while (string.length < 5) {
    string+=characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return string;
}

exports.handle = function(req, res) {
  var key = createKey();
  var content = req.body.content;
  console.log('con', content)
  if (!content || content.length == 0) {
    res.status(400).send({ error: 'Invalid content' });
  } else if (content.length > 50000) {
    res.status(414).send({ error: 'Content too long' });
  }else {
    var language = req.body.language;
    if (language == null) {
      language = undefined;
    }
    if (language && !validator.isAlphanumeric(language)) {
      res.send({ error: 'Invalid language' });
    } else {
      var content = { 
        content: req.body.content,
        _id: key,
        language: language
      };
      
      database.insertDocument(content);
      res.send({ id: key });
      console.log('Created', key);
    }
  }
}