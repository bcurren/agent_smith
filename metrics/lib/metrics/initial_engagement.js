var bm = require('../../lib/base_metric');

InitialEngagement = function() {};

InitialEngagement.prototype = new bm.BaseMetric;
InitialEngagement.prototype.constructor = InitialEngagement;
InitialEngagement.prototype.chartData = function(start_date, callback) {
  db.collection('events', function(err, collection){    
    collection.find(function(err, cursor) {
      cursor.toArray(function(err, items) {   
        callback(items)
      });
    });

  })
};

exports.Metric = InitialEngagement;