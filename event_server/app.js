require.paths.unshift(__dirname + '/lib')
require.paths.unshift(__dirname + '/..')

var sys = require('sys'),
  http = require('http'),
  fs = require('fs'),
  mongo = require('deps/node-mongodb-native/lib/mongodb'),
  AgentSmith = require('agent_smith').AgentSmith

// Parse the configuration options
try {
  var configJSON = fs.readFileSync(__dirname + "/config/app.json", "utf8")
} catch(e) {
  sys.log("File config/app.json not found.  Try: `cp config/app.json.sample config/app.json`")
}
var config = JSON.parse(configJSON)

// Create a db connection
db = new mongo.Db(config.database_name, new mongo.Server(config.mongo_host, config.mongo_port, {}), {})
db.addListener("error", function(error) {
  sys.puts("Error connecting to mongo -- perhaps it isn't running?")
})

var agent_smith = new AgentSmith()
db.open(function(p_db) {
  agent_smith.init(db, function() {})
})

module.exports = http.createServer(function(req, res) {
  try {
    agent_smith.serveRequest(req, res)
  } catch(e) {
    agent_smith.handleError(req, res, e)
  }
})
