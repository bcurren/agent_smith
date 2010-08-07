var bm = require('../../lib/base_metric'),
events = require('events'),
sys = require('sys')

FISearchFail = function() {
  bm.BaseMetric.call(this)
  var self = this  
  this.currentTimeInMillis = null,
  this.thirtyDaysAgoInMillis = null,
  this.currentTime = null,
  this.thirtyDaysAgo = null,
  this.eventEmitter = new events.EventEmitter(),
  this.counterHash = {},
  this.results = {},
  
  this.__findSearches = function(doneEvent) {
    db.collection('events', function(err, collection){
      collection.group(
        ["query"],
        { "event_name" : "fi_search"},
        { "count": 0 },
        function(item, counter){ counter.count++; },
        function(err, results){ self.eventEmitter.emit(doneEvent, results) }
      )
    })
  },
  
  this.__buildTable = function(results) {
    var data = "";
    
    results = results.sort(function(a, b){
      if (a.count > b.count) {
        return -1;
      } else if (a.count < b.count) {
        return 1;
      } else {
        return 0;
      }
    });
    
    data += "<table>";
    for (var i = 0; i < results.length; i++) {
      data += "<tr><td>" + results[i].query + "</td><td>" + results[i].count + "</td></tr>";
    }
    data += "</table>";
    
    return new String(data);
  }
}

FISearchFail.prototype.chartData = function(callback) {
  var self = this
    
  self.eventEmitter.addListener('foundSearches', function(results){
    self.results['allSearches'] = results
    callback(
      self.__buildTable(self.results['allSearches'])
    )      
    self.eventEmitter.removeAllListeners('foundSearches')      
  }) 
  self.__findSearches('foundSearches')
}

exports.Metric = FISearchFail;