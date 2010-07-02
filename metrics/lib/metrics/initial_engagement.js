var bm = require('base_metric');

InitialEngagement = function() {};

InitialEngagement.prototype = new bm.BaseMetric;
InitialEngagement.prototype.constructor = InitialEngagement;
InitialEngagement.prototype.chartData = function(start_date) {
  return {
    "subject_type": "Txn",
    "subject_id": 10,
    "event_name": "created",
    "manual": true
  }
};

exports.Metric = InitialEngagement;