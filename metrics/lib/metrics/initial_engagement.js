var bm = require('../../lib/base_metric'),
events = require('events')

InitialEngagement = function() {
  var self = this
  var thirtyDaysAgoInMillis = null  //todo: var this
  var currentTimeInMillis = null  
  var currentTime = null  
  var thirtyDaysAgo = null  
  this.eventEmitter = new events.EventEmitter(),
  this.counterHash = {},
  this.__chartManualTxnData = function (){  
    db.collection('events', function(err, collection){    
      collection.group(
        ["user_id"], 
        self.__manualTxnConditions(), 
        self.__groupInitial(), 
        self.__reduce, 
        function(err, results) {
          self.eventEmitter.emit('manualGroupDone', self.__finalize(results, true))
        }
      );
    })  
  },  
  this.__chartCompanyImporterData = function(){  
    db.collection('events', function(err, collection){    
      collection.group(
        ["user_id"], 
        self.__companyImporterConditions(), 
        self.__groupInitial(), 
        self.__reduce, 
        function(err, results) {
          self.eventEmitter.emit('ciGroupDone', self.__finalize(results, true))
        }
      );
    })  
  },
  this.__chartUserData = function(){
    db.collection('events', function(err, collection){    
      collection.group(
        ["user_id"], 
        {'subject_type': 'User', 'event_name': 'created', 'user_created_at_in_millis': {'$gte': self.__thirtyDaysAgoInMillis()}}, 
        self.__groupInitial(), 
        self.__reduce, 
        function(err, results) {        
          self.eventEmitter.emit('chartUsersDone', self.__finalize(results, false))
        }
      );
    })    
  },
  this.__manualTxnConditions = function(){
    return {
      'manual': 'true', 
      'subject_type': 'Txn', 
      'event_name': 'created', 
      'user_created_at_in_millis': {'$gte': self.__thirtyDaysAgoInMillis()}
    }  
  },
  this.__companyImporterConditions = function(){
    return {
      'subject_type': 'CompanyImporter', 
      'event_name': 'created', 
      'user_created_at_in_millis': {'$gte': self.__thirtyDaysAgoInMillis()}
    }  
  },
  this.__groupInitial = function(){
    return {"date": "", "count":0}
  },
  this.__reduce = function(obj, prev){
    var user_created_at = obj.user_created_at
    var created_at      = obj.created_at
    prev.date           = obj.user_created_at;
    prev.txn_created    = obj.created_at;
    var difference      = Date.parse(obj.created_at) - Date.parse(obj.user_created_at);  
    prev.days = difference;
    if(difference <=  3*24*60*60*1000)
      prev.count = 1;
  },
  this.__finalize = function(records, count){
    return self.__dataNode(self.__sumUserIdGroupsByDate(records, count))
  },
  this.__sumUserIdGroupsByDate = function(results, count){
    var returnHash = {}
    for (var i = 0, len = results.length; i < len; ++i){
      var fmtDate = self.__formattedDate(new Date(results[i].date))
      if (count){
        if (self.counterHash[fmtDate] == null) {
          self.counterHash[fmtDate] = results[i].count
        } else {
          self.counterHash[fmtDate] = self.counterHash[fmtDate] + results[i].count      
        }
      }
      if (returnHash[fmtDate] == null) {
        returnHash[fmtDate] = results[i].count      
      } else {
        returnHash[fmtDate] = returnHash[fmtDate] + results[i].count
      }
    }
    return returnHash
  },
  this.__sortArrayByDate = function(result){
    return result.sort(function(a, b){
      var dateA = new Date(a[0])
      var dateB = new Date(b[0])
      if (dateA == dateB) {
        return 0
      } else if (dateA < dateB) {
        return -1
      } else {
        return 1
      }
    })
  },
  this.__buildArray = function(hshGroupedDates) {
    var result = []
    for (var key in hshGroupedDates) {
      result.push([key, hshGroupedDates[key]])
    }  
    return result  
  },
  this.__dataNode = function(data){
    return self.__sortArrayByDate(self.__buildArray(data))
  },
  this.__dojoChartingStructure = function(manualTxnData, ciData, userData){
    return {
      startDate:  self.__formattedDate(self.__thirtyDaysAgo()),
      endDate:    self.__formattedDate(self.__currentTime()),
      viewBy:     "day",
      series: [
        { name: "Manual Txns",        data: manualTxnData },
        { name: "Company Importers",  data: ciData        },
        { name: "Users",              data: userData        },      
      ]
    }  
  },
  this.__formattedDate = function(date){
    return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
  },   
  this.__thirtyDaysAgoInMillis = function(){
    if (!thirtyDaysAgoInMillis){
      thirtyDaysAgoInMillis =  self.__currentTimeInMillis() - 30 * 24 * 60 * 60 * 1000
    }
    return thirtyDaysAgoInMillis
  },
  this.__currentTimeInMillis = function(){
    if (!currentTimeInMillis){
      currentTimeInMillis = self.__currentTime().getTime() 
    }
    return currentTimeInMillis
  },
  this.__currentTime = function(){
    if (!currentTime){
      currentTime = new Date()
    }
    return currentTime
  },
  this.__thirtyDaysAgo = function(){
    if (!thirtyDaysAgo){
      thirtyDaysAgo = new Date(self.__thirtyDaysAgoInMillis())
    }
    return thirtyDaysAgo
  } 
};

InitialEngagement.prototype = new bm.BaseMetric;
InitialEngagement.prototype.constructor = InitialEngagement;
InitialEngagement.prototype.chartData = function(callback) {
  var self = this
  var manTxnResults, ciResults
  self.eventEmitter.addListener('manualGroupDone', function (manualTxnData){
    manTxnResults = manualTxnData
    self.__chartCompanyImporterData()
    self.eventEmitter.removeAllListeners('manualGroupDone')
  })
  self.eventEmitter.addListener('ciGroupDone', function(ciData){      
    ciResults = ciData    
    self.__chartUserData()
    self.eventEmitter.removeAllListeners('ciGroupDone')    
  })  
  self.eventEmitter.addListener('chartUsersDone', function(userData){
    for(var i = 0; i < userData.length; i++) {
      userData[i][1] = (self.counterHash[self.__formattedDate(new Date(userData[i][0]))] / (userData[i][1] ) ) * 100.0
      self.eventEmitter.removeAllListeners('chartUsersDone')      
    }    
    callback(
      self.__dojoChartingStructure(
        manTxnResults,
        ciResults,
        userData
      )
    )
  })
  self.__chartManualTxnData()
}


exports.Metric = InitialEngagement;