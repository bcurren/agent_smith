require.paths.unshift(__dirname + '/lib');
require.paths.unshift(__dirname);

var sys = require('sys'),
  http = require('http'),
  fs = require('fs'),
  mongo = require('deps/node-mongodb-native/lib/mongodb'),
  AgentSmith = require('agent_smith').AgentSmith;

try {
  var configJSON = fs.readFileSync(__dirname + "/config/app.json", "utf8");
} catch(e) {
  sys.log("File config/app.json not found.  Try: `cp config/app.json.sample config/app.json`");
}
var config = JSON.parse(configJSON);

db = new mongo.Db(config.database_name, new mongo.Server(config.mongo_host, config.mongo_port, {}), {});

db.addListener("error", function(error) {
  sys.puts("Error connecting to mongo -- perhaps it isn't running?");
});

db.open(function(p_db) {
  var agent_smith = new AgentSmith();
  agent_smith.init(db, function() {
    http.createServer(function(req, res) {
      try {
        agent_smith.serveRequest(req, res);
      } catch(e) {
        agent_smith.handleError(req, res, e);
      }
    }).listen(config.listen_port);
  });

  sys.puts('Tracking server running at http://*:' + config.listen_port + '/tracking_pixel.gif');
});
