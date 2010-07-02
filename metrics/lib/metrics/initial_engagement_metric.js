var bm = require('base_metric');

InitialEngagementMetric = function() {};

InitialEngagementMetric.prototype = new bm.BaseMetric;
InitialEngagementMetric.prototype.constructor = InitialEngagementMetric;
InitialEngagementMetric.prototype.chartData = function() {
  return {
    "subject_type": "Txn",
    "subject_id": 10,
    "event_name": "created",
    "manual": true
  }
};

exports.InitialEngagementMetric = InitialEngagementMetric;