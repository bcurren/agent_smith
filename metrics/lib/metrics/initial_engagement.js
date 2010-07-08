var bm = require('../../lib/base_metric');

InitialEngagement = function() {};

InitialEngagement.prototype = new bm.BaseMetric;
InitialEngagement.prototype.constructor = InitialEngagement;
InitialEngagement.prototype.chartData = function(callback) {
  db.collection('events', function(err, collection){    
    collection.group(
      ["user_id"], 
      {"manual": 'true', "subject_type": 'Txn', "event_name": 'created'}, 
      {"date": "", "count":0, "txn_created": "", "days": ""}, 
      InitialEngagement.prototype.__reduce, 
      function(err, results) {
        callback(InitialEngagement.prototype.__finalize(results))
      }
    );
  })


}



InitialEngagement.prototype.__reduce = function(obj, prev){
  var user_created_at = obj.user_created_at
  var created_at      = obj.created_at
  prev.date           = obj.user_created_at;
  prev.txn_created    = obj.created_at;
  var difference      = Date.parse(obj.created_at) - Date.parse(obj.user_created_at);  
  prev.days = difference;
  if(difference <=  3*24*60*60*1000)
    prev.count = 1;
}


InitialEngagement.prototype.__finalize = function(records){  
  var hshGroupedDates = {}

  __groupCountsByDate(records, hshGroupedDates)

  return __sortArrayByDate(__buildArray(hshGroupedDates))
}


var __formattedDate = function(date){
  return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
}

var __sortArrayByDate = function(result){
  return result.sort(function(a, b){
    dateA = new Date(a.date)
    dateB = new Date(b.date)
    if (dateA == dateB) {
      return 0
    } else if (dateA < dateB) {
      return -1
    } else {
      return 1
    }
  })
}

var __groupCountsByDate = function(records, hshGroupedDates){
  for (var i = 0, len = records.length; i < len; ++i){
    fmtDate = __formattedDate(new Date(records[i].date))
    if (hshGroupedDates[fmtDate] == null) {
      hshGroupedDates[fmtDate] = records[i].count
    } else {
      hshGroupedDates[fmtDate] = hshGroupedDates[fmtDate] + records[i].count
    }
  }
}

var __buildArray = function(hshGroupedDates) {
  var result = []
  for (var key in hshGroupedDates) {
    result.push([key, hshGroupedDates[key]])
  }  
  return result  
}

exports.Metric = InitialEngagement;