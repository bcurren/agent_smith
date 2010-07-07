sys = require('sys')
mongo = require('../deps/node-mongodb-native/lib/mongodb')
InitialEngagement = require('../lib/metrics/initial_engagement').Metric


db = new mongo.Db('agent_smith_test', new mongo.Server('localhost', 27017, {}), {});
var ie = new InitialEngagement


var self = this;
exports['test myfunc'] = function(assert, beforeExit){  
  var results  
  __runSuite(function(){
    ie.chartData("2010-01-01", function(txns) {
      results = txns
    })      
  })  
  beforeExit(function(){        
    assert.equal(3, results.length);
  });  
}


exports['test group'] = function(assert, beforeExit){
  var bar
  __runSuite(function(){
    bar = 'hell yeah'
  })
  beforeExit(function(){
    assert.equal(3, bar)
  })  
}



















// PRIVATE
var __runSuite = function(callback){ 
  db.open(function(p_db){
    __setup()
    callback.call()
    __teardown()
    db.close()
  })
}

var __setup = function(){  
  db.collection('events', function(err, collection){
    collection.insert([ie_txn, non_ie_txn], function(err, ids){})      
  })  
}

var __teardown = function(){  
  db.collection('events', function(err, collection){
    collection.remove(function(err, collection){})      
  })      
}


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

    
