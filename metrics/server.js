require.paths.unshift(__dirname + '/lib');
require.paths.unshift(__dirname + '/lib/metrics');
require.paths.unshift(__dirname + '/..');
require.paths.unshift(__dirname + '/../deps/express/lib')
require.paths.unshift(__dirname + '/../deps/express/support/ejs/lib')

var sys = require('sys'),
  fs = require('fs'),
  mongo = require('deps/node-mongodb-native/lib/mongodb'),
  svc = require('service_json'),
  express = require('express'),
  connect = require('connect');

try {
  var configJSON = fs.readFileSync(__dirname + "/config/app.json", "utf8");
} catch(e) {
  sys.log("File config/app.json not found.  Try: `cp config/app.json.sample config/app.json`");
}
var config = JSON.parse(configJSON);

var app = express.createServer(
  connect.staticProvider(),
  connect.cookieDecoder(),
  connect.logger()
);

db = new mongo.Db('agent_smith', new mongo.Server('localhost', 27017, {}), {});
db.open(function(p_db) {
  app.configure(function(){
    app.set('root', __dirname);
    app.set('db', db);

    for(var i in config) {
      app.set(i, config[i]);
    }
  });

  app.get('/', function(req, res, params){
    res.render('index.ejs', {
      locals: {
        report: params["report_name"]
      }
    });
  });

  app.get('/:report_name', function(req, res, params){
    var mc = require(params['report_name']);
    var metric = new mc.Metric;
    res.contentType('application/json');
    metric.chartData(function(response){
      res.respond(200, JSON.encode(response));
    })
  });
  
  sys.log("Started server with config: ");
  sys.puts(configJSON);
  app.listen(config.monitor_port)
});
