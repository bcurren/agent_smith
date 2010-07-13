assert = require('assert')
http = require('http');
server = http.createClient(8888, 'localhost');
sys = require('sys')
today = new Date()

runTest = function (testName, callback){
  request.addListener('response', function (response) {
    response.setEncoding('utf8');
    response.addListener('data', function (body) {
      console.log(testName)
      try {
        callback(body)
        sys.log('yee hawww')
      } catch (err) {
        sys.log('yer bummin: ' + sys.inspect(err))
      }
    
      process.emit('testsDone')
      
    });
  });
}

stubbedTxnEvent = function(userCreatedAt, objCreatedAt){
  return __stubbedEvent("Txn", userCreatedAt, objCreatedAt)
}

stubbedCiEvent = function(userCreatedAt, objCreatedAt){
  return __stubbedEvent('CompanyImporter', userCreatedAt, objCreatedAt)
}


function __stubbedEvent(objType, userCreatedAt, objCreatedAt){
  returnObj =  {
    "event_name" : "created" , 
    "subject_type" : objType, 
    "subject_id" : __nextId() , 
    "user_created_at" : userCreatedAt.toString(),
    "user_created_at_in_millis" : userCreatedAt.getTime() ,    
    "user_id" : __nextId() , 
    "created_at" : objCreatedAt.toString(), 
    "timestamp" : new Date().toString()
  }  
  if (objType == "Txn")
    returnObj['manual'] = 'true'
  return returnObj
}





nextId = 1000
function __nextId(){
  return (nextId ++).toString()
}




daysAgo = function(nDaysAgo) {
  return new Date(today.getTime() - nDaysAgo * 24 * 60 * 60 * 1000)
}


setup = function(){

    db.collection('events', function(err, collection){
      for (var i = 0; i < txnEventDates.length ; i++) {
        collection.insert([stubbedTxnEvent(txnEventDates[i][0], txnEventDates[i][1])], function(err, ids){})      
      }
  })  
  request = server.request('GET', '/initial_engagement');
  request.end();    
}


teardown = function(){

    db.collection('events', function(err, collection){
      collection.remove(function(err, collection){})      
    })
}


hashByDate = function(response){
  result = {}
  for (var i = 0, len = response.length; i < len; ++i){
    thisElement = response[i]
    result[thisElement[0]] = thisElement[1]
  }  
  return result
}

formattedDate = function(date){
  return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
}
