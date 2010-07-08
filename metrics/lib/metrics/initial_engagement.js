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
  result = []
  intermediate = {}
  for (var i = 0, len = records.length; i < len; ++i){
    rawDate = new Date(records[i].date)
    fmtDate = (rawDate.getMonth() + 1) + "/" + rawDate.getDate() + "/" + rawDate.getFullYear()
    if (intermediate[fmtDate] == null) {
      intermediate[fmtDate] = records[i].count
    } else {
      intermediate[fmtDate] = intermediate[fmtDate] + records[i].count
    }
  }
  
  for (var key in intermediate) {
    result.push({'date': key, 'count': intermediate[key]})
  }  
  
  var sortedResult = result.sort(function(a, b){
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

  return sortedResult
}





exports.Metric = InitialEngagement;