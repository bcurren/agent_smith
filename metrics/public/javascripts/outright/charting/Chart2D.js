dojo.provide("outright.charting.Chart2D");

dojo.require("dojox.charting.Chart2D");
dojo.require("dojox.charting.themes.PlotKit.cyan");

dojo.require("dojox.charting.action2d.Highlight");
dojo.require("dojox.charting.action2d.Magnify");
dojo.require("dojox.charting.action2d.MoveSlice");
dojo.require("dojox.charting.action2d.Shake");
dojo.require("dojox.charting.action2d.Tooltip");

dojo.require("dojox.charting.widget.Legend");

dojo.require("dojo.colors");
dojo.require("dojo.fx.easing");

dojo.declare("outright.charting.Chart2D", null, {
  constructor: function(chartDomId, legendDomId, reportData, plotSpecs) {
    this.chart = new dojox.charting.Chart2D(chartDomId);
    this.chart.setTheme(dojox.charting.themes.PlotKit.cyan);
    
    this.chart.addAxis("x", {
      labels: this._createLabels(reportData.series[0].data)
    });
    this.chart.addAxis("y", {
      vertical: true,
      includeZero: true
    });

    for (var plotSpecIndex in plotSpecs) {
      var plotSpec = plotSpecs[plotSpecIndex];
      var plotData = reportData.series[plotSpec.seriesIndex];
      this._addPlot(plotData, plotSpec.plot, plotSpec.type);
    }

    this.chart.render();

    var legend1 = new dojox.charting.widget.Legend({
      chart: this.chart, 
      horizontal: false
    }, legendDomId);
  },
  
  _addPlot: function(plotData, plotName, chartType) {
    this.chart.addPlot(plotName, {
      type: chartType,
      lines: true, 
      markers: true, 
      tension: 2
    });

    this.chart.addSeries(plotData.name, this._createSeriesData(plotData), {
      plot: plotName
    });

    var anim1a = new dojox.charting.action2d.Magnify(this.chart, plotName);
    var anim1b = new dojox.charting.action2d.Tooltip(this.chart, plotName);
  },
  
  _createSeriesData: function(plotData) {
    var self = this;
    var chartValues = dojo.map(plotData.data, function(datum, datumIndex) {
      return {
        x: datumIndex + 1,
        y: datum[1],
        tooltip: self._createTooltip(plotData.name, datum)
      };
    });
    
    return chartValues;
  },
  
  _createTooltip: function(seriesName, datum) {
    var label = datum[0];
    var date = new Date(label);
    var daysOfTheWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    
    return datum[1] + " " + seriesName + " on " + label + "<br />which is a " + daysOfTheWeek[date.getDay()] 
  },
  
  _createLabels: function(data) {
    var labels = dojo.map(data, function(datum, datumIndex) {
      return {
        value: datumIndex + 1,
        text: datum[0]
      }
    });
    
    return labels;
  }
});
