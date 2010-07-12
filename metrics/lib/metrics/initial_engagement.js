var bm = require('../../lib/base_metric');

InitialEngagement = function() {};

InitialEngagement.prototype = new bm.BaseMetric;
InitialEngagement.prototype.constructor = InitialEngagement;
InitialEngagement.prototype.chartData = function(callback) {
  process.addListener('manualGroupDone', function(manualTxnData){
    process.emit('afterManualGroupDone')
    process.addListener('ciGroupDone', function(ciData){
      process.emit('afterCiGroupDone')      
      callback(
        __dojoChartingStructure(
          manualTxnData,
          ciData
        )
      )      
    })
  })
  __chartManualTxnData()
  __chartCompanyImporterData()
}


function __chartManualTxnData(){
  db.collection('events', function(err, collection){    
    collection.group(
      ["user_id"], 
      __manualTxnConditions(), 
      __groupInitial(), 
      __reduce, 
      function(err, results) {
        process.emit('manualGroupDone', __finalize(results))
      }
    );
  })  
}

function __chartCompanyImporterData(){
  db.collection('events', function(err, collection){    
    collection.group(
      ["user_id"], 
      __companyImporterConditions(), 
      __groupInitial(), 
      __reduce, 
      function(err, results) {
        process.emit('ciGroupDone', __finalize(results))
      }
    );
  })  
}

function __manualTxnConditions(){
  return {
    'manual': 'true', 
    'subject_type': 'Txn', 
    'event_name': 'created', 
    'user_created_at_in_millis': {'$gte': __thirtyDaysAgoInMillis()}
  }  
}

function __companyImporterConditions(){
  return {
    'subject_type': 'CompanyImporter', 
    'event_name': 'created', 
    'user_created_at_in_millis': {'$gte': __thirtyDaysAgoInMillis()}
  }  
}

function __groupInitial(){
  return {"date": "", "count":0}
}

function __reduce(obj, prev){
  var user_created_at = obj.user_created_at
  var created_at      = obj.created_at
  prev.date           = obj.user_created_at;
  prev.txn_created    = obj.created_at;
  var difference      = Date.parse(obj.created_at) - Date.parse(obj.user_created_at);  
  prev.days = difference;
  if(difference <=  3*24*60*60*1000)
    prev.count = 1;
}

function __finalize(records){
  return __dataNode(__sumUserIdGroupsByDate(records))
}

function __sortArrayByDate(result){
  return result.sort(function(a, b){
    dateA = new Date(a[0])
    dateB = new Date(b[0])
    if (dateA == dateB) {
      return 0
    } else if (dateA < dateB) {
      return -1
    } else {
      return 1
    }
  })
}

function __sumUserIdGroupsByDate(results){
  returnHash = {}
  for (var i = 0, len = results.length; i < len; ++i){
    fmtDate = __formattedDate(new Date(results[i].date))
    if (returnHash[fmtDate] == null) {
      returnHash[fmtDate] = results[i].count
    } else {
      returnHash[fmtDate] = returnHash[fmtDate] + results[i].count
    }
  }
  return returnHash
}

function __buildArray(hshGroupedDates) {
  var result = []
  for (var key in hshGroupedDates) {
    result.push([key, hshGroupedDates[key]])
  }  
  return result  
}

function __dataNode(data){
  return __sortArrayByDate(__buildArray(data))
}

function __dojoChartingStructure(manualTxnData, ciData){
  return {
    startDate:  __formattedDate(__thirtyDaysAgo()),
    endDate:    __formattedDate(__currentTime()),
    viewBy:     "day",
    series: [
      { name: "Manual Txns",        data: manualTxnData },
      { name: "Company Importers",  data: ciData        }
    ]
  }  
}

function __formattedDate(date){
  return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
}

thirtyDaysAgoInMillis = null
function __thirtyDaysAgoInMillis(){
  if (!thirtyDaysAgoInMillis){
    thirtyDaysAgoInMillis =  __currentTimeInMillis() - 30 * 24 * 60 * 60 * 1000
  }
  return thirtyDaysAgoInMillis
}

currentTimeInMillis = null
function __currentTimeInMillis(){
  if (!currentTimeInMillis){
    currentTimeInMillis = __currentTime().getTime() 
  }
  return currentTimeInMillis
}

currentTime = null
function __currentTime(){
  if (!currentTime){
    currentTime = new Date()
  }
  return currentTime
}

thirtyDaysAgo = null
function __thirtyDaysAgo(){
  if (!thirtyDaysAgo){
    thirtyDaysAgo = new Date(__thirtyDaysAgoInMillis())
  }
  return thirtyDaysAgo
}








exports.Metric = InitialEngagement;