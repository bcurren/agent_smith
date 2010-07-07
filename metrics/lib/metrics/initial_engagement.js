var bm = require('../../lib/base_metric');

InitialEngagement = function() {};

InitialEngagement.prototype = new bm.BaseMetric;
InitialEngagement.prototype.constructor = InitialEngagement;
InitialEngagement.prototype.chartData = function(start_date, callback) {
  var return_result = 'foo'
  db.collection('events', function(err, collection){
    collection.find(function(err, cursor){
      return_result = cursor
    })
    callback(return_result)
  // //   // collection.group([], {}, {"count":0}, "function (obj, prev) { prev.count++; }", function(err, results) {
  // //   //  return_result = results
  // //   // })
  })
  db.close()  
  sys.log(sys.inspect(return_result))
};

exports.Metric = InitialEngagement;