var express = require('express');
var router = express.Router();
var database = require('../lib/database');
var routeCache = require('route-cache');
var redis = require('redis');
var redisConfig = require('../config/redis');
var client = redis.createClient(redisConfig);

var RateLimit = require('ratelimit.js').RateLimit;
var ExpressMiddleware = require('ratelimit.js').ExpressMiddleware;

var multer  = require('multer')
var upload = multer()

var rules = [
  { // 10/min
    interval: 60000,
    limit: 10,
  },
  { // 100/5min
    interval: 300000,
    limit: 100,
  },
  { // 500/hr
    interval: 3600000,
    limit: 500
  },
  { // 2000/day
    interval: 86400000,
    limit: 2000
  }
];
var limiter = new RateLimit(client, rules);
var limitMiddleware = new ExpressMiddleware(limiter, { ignoreRedisErrors: true });


var limitOptions = {
  extractIps: function(req) {
    var ip = req.headers['x-forwarded-for'] || 
     req.connection.remoteAddress || 
     req.socket.remoteAddress ||
     req.connection.socket.remoteAddress;
    return ip;
  }
};

var limitEndpoint = limitMiddleware.middleware(limitOptions, function(req, res, next) {
  res.status(429).json({ error: 'rate limit exceeded' });
});

var cacheTime = 7 * (1000*60*60*24);
//var cacheTime = 0;
var index = require('./index')(database);
var create = require('./create')(database);
var view = require('./view')(database);
var raw = require('./raw')(database);


router.get('/', routeCache.cacheSeconds(cacheTime), index.handle);
router.get('/n/:id', routeCache.cacheSeconds(cacheTime), index.handle);
router.get('/:id', routeCache.cacheSeconds(cacheTime), view.handle);
router.get('/:id/raw', routeCache.cacheSeconds(cacheTime), raw.handle);
router.post('/create', limitEndpoint, create.handle);

router.post('/createMulti', upload.single('text'), function (req, res, next) {
  create.handle(req, res);
})

module.exports = router;