BaseMetric = function() {};

BaseMetric.prototype = {
  chartData: function() {
    throw "Method not implemented!";
  }
};

exports.BaseMetric = BaseMetric;