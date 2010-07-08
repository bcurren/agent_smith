sys = require('sys')
mongo = require('../deps/node-mongodb-native/lib/mongodb')
InitialEngagement = require('../lib/metrics/initial_engagement').Metric


db = new mongo.Db('agent_smith_test', new mongo.Server('localhost', 27017, {}), {});
var ie = new InitialEngagement


var self = this;
exports['chartData'] = function(assert, beforeExit){  
  var chartDataResponse, finalizeResponse  
  db.open(function(p_db){
    __setup()    
    
    //first test
    ie.chartData(function(txns) { chartDataResponse = txns })  

    
    
    __teardown()
    db.close()
  })    
  beforeExit(function(){            
    var hashedChartDataResponse = __responseHashedByDate(chartDataResponse)
    assert.equal(1, hashedChartDataResponse['7/5/2010'], 'unexpected count for: 7/5/2010: ' + hashedChartDataResponse['7/5/2010'] )
  });  
}









// PRIVATE

var __setup = function(){  
  db.collection('events', function(err, collection){
    collection.insert([ie_txn, non_ie_txn, imported_txn, non_txn], function(err, ids){})      
  })  
}

var __teardown = function(){  
  db.collection('events', function(err, collection){
    collection.remove(function(err, collection){})      
  })      
}


var __responseHashedByDate = function(response){
  result = {}
  for (var i = 0, len = response.length; i < len; ++i){
    thisElement = response[i]
    result[thisElement.date] = thisElement.count
  }  
  return result
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
  "subject_id" : "1955276502" , 
  "user_created_at" : "Mon, 05 Jul 2010 14:04:16 -0700" , 
  "user_id" : "2084271014" , 
  "created_at" : "Wed, 10 Jul 2010 14:04:16 -0700" , 
  "timestamp" : "Tue Jul 06 2010 14:06:22 GMT-0700 (PDT)"
}


var imported_txn = {
  "event_name" : "created" , 
  "subject_type" : "Txn" , 
  "subject_id" : "1955276502" , 
  "user_created_at" : "Mon, 05 Jul 2010 14:04:16 -0700" , 
  "user_id" : "2084271014" , 
  "created_at" : "Mon, 05 Jul 2010 14:04:16 -0700" , 
  "timestamp" : "Tue Jul 06 2010 14:06:22 GMT-0700 (PDT)"
}


var non_txn = {
  "event_name" : "created" , 
  "subject_type" : "User" , 
  "manual" : "true" , 
  "subject_id" : "2" , 
  "user_id" : "2" , 
  "user_created_at" : "Mon, 05 Jul 2010 14:04:16 -0700" ,   
  "created_at" : "Mon, 05 Jul 2010 14:04:16 -0700" , 
  "timestamp" : "Tue Jul 06 2010 14:06:22 GMT-0700 (PDT)"
}







    
