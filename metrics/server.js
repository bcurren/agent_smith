require.paths.unshift(__dirname + '/lib');
require.paths.unshift(__dirname + '/lib/metrics');
require.paths.unshift(__dirname);
require.paths.unshift(__dirname + '/deps/express/lib')

var sys = require('sys'),
  fs = require('fs'),
  mongo = require('deps/node-mongodb-native/lib/mongodb'),
  svc = require('service_json');

require('express');
require('express/plugins');

db = new mongo.Db('agent_smith', new mongo.Server('localhost', 27017, {}), {});

db.open(function(p_db) {
  configure(function(){
    set('root', __dirname);
    set('db', db);
    use(Static);
    use(Cookie);
    use(Logger);

    try {
      var configJSON = fs.readFileSync(__dirname + "/config/app.json", "utf8");
    } catch(e) {
      sys.log("File config/app.json not found.  Try: `cp config/app.json.sample config/app.json`");
    }

    sys.log("Started server with config: ");
    sys.puts(configJSON);
    var config = JSON.parse(configJSON);

    this.server.port = config.monitor_port;

    for(var i in config) {
      set(i, config[i]);
    }

  });

  get('/', function(){
    this.contentType('html');
    this.render('index.html.ejs', {
      locals: {
        report: this.param("report_name")
      }
    });
  });

  get('/:report_name', function(){
    var mc = require(this.param('report_name'));
    var metric = new mc.Metric;
    this.contentType('application/json');
    return JSON.encode(metric.chartData());
  });

  run();
});
