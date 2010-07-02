require.paths.unshift('spec', './spec/lib', 'lib')
require.paths.unshift(__dirname + '/../lib');
require.paths.unshift(__dirname + '/../lib/metrics');
require.paths.unshift(__dirname + '/..');

require('jspec');
require('unit/spec.helper');
bm = require('base_metric');
ie = require('initial_engagement_metric');
http = require('http');
sys = require('sys');
mongo = require('deps/node-mongodb-native/lib/mongodb');

db = new mongo.Db('agent_smith_test', new mongo.Server('localhost', 27017, {}), {});

db.open(function(p_db) {
  JSpec
    .exec('spec/unit/base_metric_spec.js')
    .exec('spec/unit/metrics/initial_engagement_metric_spec.js')
    .run({ reporter: JSpec.reporters.Terminal, fixturePath: 'spec/fixtures', failuresOnly: true })
    .report()
});
