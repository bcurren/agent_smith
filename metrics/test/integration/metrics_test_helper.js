assert = require('assert')
http = require('http');
server = http.createClient(8888, 'localhost');
sys = require('sys')

runTest = function (testName, callback){
  request.addListener('response', function (response) {
    response.setEncoding('utf8');
    response.addListener('data', function (body) {
      console.log(testName)
      callback(body)
    });
  });
}






stubbedEvent = function(userCreatedAt, objCreatedAt){
  return {
    "event_name" : "created" , 
    "manual" : "true" , 
    "subject_type" : "Txn" , 
    "subject_id" : "1955276501" , 
    "user_created_at" : userCreatedAt.toString(),
    "user_created_at_in_millis" : userCreatedAt.getTime() ,    
    "user_id" : "2084271013" , 
    "created_at" : objCreatedAt, 
    "timestamp" : new Date()
  }
}