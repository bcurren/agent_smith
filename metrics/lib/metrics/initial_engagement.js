var bm = require('../../lib/base_metric');

InitialEngagement = function() {};

InitialEngagement.prototype = new bm.BaseMetric;
InitialEngagement.prototype.constructor = InitialEngagement;
InitialEngagement.prototype.chartData = function(callback) {
  db.collection('events', function(err, collection){    
    collection.group(
      ["user_id"], 
      {}, 
      {"date": "", "count":0, "txn_created": "", "days": ""}, 
      __reduce, 
      function(err, results) {
        callback(results)
      }
    );
  })


}



var __reduce = function(obj, prev){
  prev.date = obj.user_created_at;
  prev.txn_created = obj.created_at;
  var difference = Date.parse(obj.created_at) - Date.parse(obj.user_created_at);  
  prev.days = difference;
  if(difference <=  3*24*60*60*1000)
    prev.count = 1;
}




exports.Metric = InitialEngagement;