var bm = require('../../lib/base_metric'),
events = require('events'),
sys = require('sys')

FISearch = function() {
  bm.BaseMetric.call(this)
  var self = this  
  this.currentTimeInMillis = null,
  this.thirtyDaysAgoInMillis = null,
  this.currentTime = null,
  this.thirtyDaysAgo = null,
  this.eventEmitter = new events.EventEmitter(),
  this.counterHash = {},
  this.results = {},
  
  this.__findSearches = function(doneEvent){
    db.collection('events', function(err, collection){
      collection.group(
        [ "date" ],
        { "event_name": "fi_search" },
        {
          count: 0, 
          empty: 0, 
          redos: 0,
          percentNonFailure: 0, 
        }, 
        function(item, summaries){
          summaries.count++;
          if (item.result_count == 0) { summaries.empty++; }
          if (item.original_query) { summaries.redos++; }
          totalSuccesses = summaries.count - summaries.redos - summaries.empty
          summaries.percentNonFailure = (totalSuccesses / summaries.count) * 100
        },
        function(err, results){
          self.eventEmitter.emit(doneEvent, results)
        }
      );
    })    
  },
  this.__dojoChartingStructure = function(allSearches){
    allSearches = allSearches.map(function(item){
      return [ item["date"], item["percentNonFailure"] ]
    });
    return {
      startDate:  self.__formattedDate(self.__thirtyDaysAgo()),
      endDate:    self.__formattedDate(self.__currentTime()),
      viewBy:     "day",
      series: [
        { name: "% Successful Searches",data: allSearches },      
      ]
    }  
  }
};
sys.inherits(FISearch, bm.BaseMetric)



FISearch.prototype.chartData = function(callback) {
  var self = this
    
  self.eventEmitter.addListener('foundSearches', function(results){
    self.results['allSearches'] = results
    callback(
      self.__dojoChartingStructure(
        self.results['allSearches']
      )
    )      
    self.eventEmitter.removeAllListeners('foundSearches')      
  }) 
  self.__findSearches('foundSearches')
}

exports.Metric = FISearch;