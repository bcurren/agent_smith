sys = require('sys')
mongo = require('../../deps/node-mongodb-native/lib/mongodb')
InitialEngagement = require('../lib/metrics/initial_engagement').Metric
db = new mongo.Db('agent_smith_test', new mongo.Server('localhost', 27017, {}), {});