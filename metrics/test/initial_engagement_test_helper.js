ie = new InitialEngagement


__setup = function(){  
  db.collection('events', function(err, collection){
    collection.insert(__fixtureObjects(), function(err, ids){})      
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


function __baseObj(userCreatedAt, createdAt, objType){
  return {
    "event_name"                : "created", 
    "manual"                    : "true", 
    "subject_type"              : objType, 
    "subject_id"                : __subjectId(), 
    "user_created_at"           : userCreatedAt.toString(),
    "user_created_at_in_millis" : userCreatedAt.getTime(),    
    "user_id"                   : __userId(), 
    "created_at"                : createdAt, 
    "timestamp"                 : new Date()
  }
}

subjectId = 0
function __subjectId(){
  return (subjectId ++).toString()
}

userId = 1000
function __userId(){
  return (userId ++).toString()
}

function __fixtureObjects(){
  return [
    ie_txn, 
    ie_txn2, 
    ie_txn3, 
    non_ie_txn, 
    imported_txn, 
    non_txn, 
    out_of_range_txn, 
    ie_ci,
    ie_ci2,
    ie_ci3,
    non_ie_ci
  ]
}


ie_txn          = __baseObj(new Date("7-5-2010"), new Date("7-7-2010"), "Txn")
ie_txn2         = __baseObj(new Date("7-5-2010"), new Date("7-7-2010"), "Txn")
ie_txn3         = __baseObj(new Date("7-6-2010"), new Date("7-7-2010"), "Txn")
non_ie_txn      = __baseObj(new Date("7-9-2010"), new Date("7-17-2010"), "Txn")
                
imported_txn    = __baseObj(new Date("7-5-2010"), new Date("7-5-2010"), "Txn")
imported_txn.manual = null

non_txn         = __baseObj(new Date("7-5-2010"), new Date("7-5-2010"), "Txn")
non_txn.subject_type = "User"

out_of_range_txn = __baseObj(new Date("7-5-2009"), new Date("7-7-2009"), "Txn")


ie_ci = __baseObj(new Date("7-5-2010"), new Date("7-7-2010"), "CompanyImporter")
ie_ci2 = __baseObj(new Date("7-5-2010"), new Date("7-7-2010"), "CompanyImporter")
ie_ci3 = __baseObj(new Date("7-6-2010"), new Date("7-7-2010"), "CompanyImporter")
non_ie_ci = __baseObj(new Date("7-9-2010"), new Date("7-17-2010"), "CompanyImporter")
