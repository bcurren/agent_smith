BaseMetric = function() {
  var self = this
  this.__formattedDate = function(date){
    return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
  },
  this.__thirtyDaysAgoInMillis = function(){
    if (!self.thirtyDaysAgoInMillis){
      self.thirtyDaysAgoInMillis =  self.__currentTimeInMillis() - 30 * 24 * 60 * 60 * 1000
    }
    return self.thirtyDaysAgoInMillis
  },
  this.__currentTimeInMillis = function(){
    if (!self.currentTimeInMillis){
      self.currentTimeInMillis = self.__currentTime().getTime() 
    }
    return self.currentTimeInMillis
  },
  this.__currentTime = function(){
    if (!self.currentTime){
      self.currentTime = new Date()
    }
    return self.currentTime
  },
  this.__thirtyDaysAgo = function(){
    if (!self.thirtyDaysAgo){
      self.thirtyDaysAgo = new Date(self.__thirtyDaysAgoInMillis())
    }
    return self.thirtyDaysAgo
  }  
};

BaseMetric.prototype = {
  chartData: function() {
    throw "Method not implemented!";
  } 
};

exports.BaseMetric = BaseMetric;