var sys = require('sys'),
  fs = require('fs'),
  Buffer = require('buffer').Buffer,
  querystring = require('querystring');

var AgentSmith = function(db, callback) {
  var pixelData = fs.readFileSync(__dirname + "/../images/tracking.gif", 'binary');
  this.pixel = new Buffer(43); // number of bytes in tracking.gif
  this.pixel.write(pixelData, 'binary', 0);

  this.metrics = [];
};

AgentSmith.prototype = {
  init: function(db, callback) {
    this.setupDb(db, function() {
      callback();
    });
  },
  
  serveRequest: function(req, res) {
    this.writePixel(res);
    var self = this
    var postData = ""
    req.addListener('data', function(chunk){
      postData += chunk
    })
    req.addListener('end', function(){
      sys.puts(req.url);
      urlData = req.url.split('?')[1]
      var queryData = [urlData, postData].filter(function(ele){ return (ele !== "") }).join('&')
      sys.debug(urlData)
      sys.debug(postData)
      sys.debug(queryData)
      var env = self.splitQuery(queryData);
      var now = new Date();
      env.date = ( now.getMonth() + 1 ) + "/" + now.getDate() + "/" + now.getFullYear();
      env.timestamp = now.getTime();
      env.user_created_at_in_millis = new Date(env.user_created_at).getTime()
      self.collection.insertAll([env]);
    })
  },
  
  handleError: function(req, res, e) {
    res.writeHead(500, {});
    res.write("Server error");
    res.close();

    e.stack = e.stack.split('\n');
    e.url = req.url;
    sys.log(JSON.stringify(e, null, 2));
  },
  
  // Need to not have a collection name hardcoded here.
  setupDb: function(db, callback) {
    var self = this;
    db.createCollection('events', function(err, collection) {
      db.collection('events', function(err, collection) {
        self.collection = collection;
        callback();
      });
    });
  },

  splitQuery: function(query) {
    var queryString = {};
    (query || "").replace(
      new RegExp("([^?=&]+)(=([^&]*))?", "g"),
      function($0, $1, $2, $3) { queryString[$1] = querystring.unescape($3.replace(/\+/g, ' ')); }
    );

    return queryString;
  },

  writePixel: function(res) {
    res.writeHead(200, { 'Content-Type': 'image/gif',
                         'Content-Disposition': 'inline',
                         'Content-Length': '43' });
    res.end(this.pixel);
  }
};

exports.AgentSmith = AgentSmith;
