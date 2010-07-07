require.paths.unshift(__dirname + '../lib');
require.paths.unshift(__dirname + '../lib/metrics');
require.paths.unshift(__dirname);
require.paths.unshift(__dirname + '../deps/express/lib')

sys = require('sys'),
fs = require('fs'),
mongo = require('../deps/node-mongodb-native/lib/mongodb'),
svc = require('../lib/service_json');

require('../lib/metrics/initial_engagement')

exports['test async'] = function(assert, beforeExit){
    var ie_txn = {
      "event_name" : "created" , 
      "manual" : "true" , 
      "subject_type" : "Txn" , 
      "subject_id" : "1955276501" , 
      "user_created_at" : "Mon, 05 Jul 2010 14:04:16 -0700" , 
      "user_id" : "2084271013" , 
      "created_at" : "Wed, 07 Jul 2010 14:04:16 -0700" , 
      "timestamp" : "Tue Jul 06 2010 14:06:22 GMT-0700 (PDT)"
    }
    var non_ie_txn = {
      "event_name" : "created" , 
      "manual" : "true" , 
      "subject_type" : "Txn" , 
      "subject_id" : "1955276501" , 
      "user_created_at" : "Mon, 05 Jul 2010 14:04:16 -0700" , 
      "user_id" : "2084271013" , 
      "created_at" : "Wed, 10 Jul 2010 14:04:16 -0700" , 
      "timestamp" : "Tue Jul 06 2010 14:06:22 GMT-0700 (PDT)"
    }
    txns = [ie_txn, non_ie_txn]    
    db = new mongo.Db('agent_smith_test', new mongo.Server('localhost', 27017, {}), {});
    var ie = new InitialEngagement  
    var results = null
    db.open(function(p_db) {
      db.collection('events', function(err, collection){
        collection.insert(ie_txn, function(err, ids) {})
      })   
      ie.chartData("2010-01-01", function(txns) {
        results = txns
      })        
      beforeExit(function(){        
        assert.equal(1, results, results.to_s);
      });
      db.close()
    })
}

