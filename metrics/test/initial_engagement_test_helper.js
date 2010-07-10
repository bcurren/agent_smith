ie = new InitialEngagement


__setup = function(){  
  db.collection('events', function(err, collection){
    collection.insert([ie_txn, non_ie_txn, imported_txn, non_txn, out_of_range_txn], function(err, ids){})      
  })  
}





__teardown = function(){  
  db.collection('events', function(err, collection){
    collection.remove(function(err, collection){})      
  })      
}


__responseHashedByDate = function(response){
  result = {}
  for (var i = 0, len = response.length; i < len; ++i){
    thisElement = response[i]
    result[thisElement[0]] = thisElement[1]
  }  
  return result
}








ie_txn = {
  "event_name" : "created" , 
  "manual" : "true" , 
  "subject_type" : "Txn" , 
  "subject_id" : "1955276501" , 
  "user_created_at" : "Mon, 05 Jul 2010 14:04:16 -0700" ,
  "user_created_at_in_millis" : new Date("Mon, 05 Jul 2010 14:04:16 -0700").getTime() ,    
  "user_id" : "2084271013" , 
  "created_at" : "Wed, 07 Jul 2010 14:04:16 -0700" , 
  "timestamp" : "Tue Jul 06 2010 14:06:22 GMT-0700 (PDT)"
}


non_ie_txn = {
  "event_name" : "created" , 
  "manual" : "true" , 
  "subject_type" : "Txn" , 
  "subject_id" : "1955276502" , 
  "user_created_at" : "Mon, 05 Jul 2010 14:04:16 -0700" , 
  "user_created_at_in_millis" : new Date("Mon, 05 Jul 2010 14:04:16 -0700").getTime() ,      
  "user_id" : "2084271014" , 
  "created_at" : "Wed, 10 Jul 2010 14:04:16 -0700" , 
  "timestamp" : "Tue Jul 06 2010 14:06:22 GMT-0700 (PDT)"
}


imported_txn = {
  "event_name" : "created" , 
  "subject_type" : "Txn" , 
  "subject_id" : "1955276502" , 
  "user_created_at" : "Mon, 05 Jul 2010 14:04:16 -0700" , 
  "user_created_at_in_millis" : new Date("Mon, 05 Jul 2010 14:04:16 -0700").getTime() ,      
  "user_id" : "2084271014" , 
  "created_at" : "Mon, 05 Jul 2010 14:04:16 -0700" , 
  "timestamp" : "Tue Jul 06 2010 14:06:22 GMT-0700 (PDT)"
}


non_txn = {
  "event_name" : "created" , 
  "subject_type" : "User" , 
  "manual" : "true" , 
  "subject_id" : "2" , 
  "user_id" : "2" , 
  "user_created_at" : "Mon, 05 Jul 2010 14:04:16 -0700" ,   
  "user_created_at_in_millis" : new Date("Mon, 05 Jul 2010 14:04:16 -0700").getTime() ,      
  "created_at" : "Mon, 05 Jul 2010 14:04:16 -0700" , 
  "timestamp" : "Tue Jul 06 2010 14:06:22 GMT-0700 (PDT)"
}


out_of_range_txn = {
  "event_name" : "created" , 
  "manual" : "true" , 
  "subject_type" : "Txn" , 
  "subject_id" : "1955276501" , 
  "user_created_at" : "Sun, 05 Jul 2009 14:04:16 -0700" , 
  "user_created_at_in_millis" : new Date("Sun, 05 Jul 2009 14:04:16 -0700").getTime() ,      
  "user_id" : "2084271011" , 
  "created_at" : "Tue, 07 Jul 2009 14:04:16 -0700" , 
  "timestamp" : "Wed Jul 07 2009 14:06:22 GMT-0700 (PDT)"
}
