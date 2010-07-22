require.paths.unshift('spec', './spec/lib', 'lib')
require.paths.unshift(__dirname + '/../lib');
require.paths.unshift(__dirname + '/../../..');

require('jspec');
require('unit/spec.helper');
as = require('agent_smith');
http = require('http');
sys = require('sys');
mongo = require('deps/node-mongodb-native/lib/mongodb');

db = new mongo.Db('agent_smith_test', new mongo.Server('localhost', 27017, {}), {});

MockRequest = function(url) {
  this.url = url;
}

MockResponse = function() {
  this.data = null;
  this.headers = null;
  this.statusCode = null;
  this.state = "open";
};

MockResponse.prototype = {
  writeHead: function(statusCode, headers) {
    this.statusCode = statusCode;
    this.headers = headers;
  },

  write: function(data, dataType) {
    this.data = data;
    this.dataType = dataType;
  },

  close: function() { this.end(); },

  end: function() {
    this.state = "closed";
  }
};

MockCollection = function() {
  this.inserts = [];
}

MockCollection.prototype = {
  insertAll: function(docs) {
    for(var i = 0; i < docs.length; i++) {
      this.inserts.push(docs[i])
    }
  }
}

db.open(function(p_db) {
  JSpec
    .exec('spec/unit/agent_smith_spec.js')
    .run({ reporter: JSpec.reporters.Terminal, fixturePath: 'spec/fixtures', failuresOnly: true })
    .report()
});
