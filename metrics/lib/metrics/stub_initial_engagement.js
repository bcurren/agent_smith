var bm = require('base_metric');

StubInitialEngagement = function() {};

StubInitialEngagement.prototype = new bm.BaseMetric;
StubInitialEngagement.prototype.constructor = StubInitialEngagement;
StubInitialEngagement.prototype.chartData = function() {
  return {
      startDate: "2010-03-30",
      endDate: "2010-04-02",
      viewBy: "day",
      series: [{
        name: "InitialEngagement",
        data: [["2010-03-30", 130], ["2010-03-31", 160], ["2010-04-01", 200], ["2010-04-02", 130], ["2010-04-03", 130]]
      }]
    }
};

exports.Metric = StubInitialEngagement;