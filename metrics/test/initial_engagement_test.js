testHelper = require('./test_helper')
ieTestHelper = require('./initial_engagement_test_helper')

exports.initialEngagementTest = function(assert, beforeExit){  
  var chartDataResponse
  db.open(function(p_db){
    __setup()    
    
    //first test
    ie.chartData(function(txns) { 
      hashManTxnResponse  = __responseHashedByDate(txns.series[0].data )
      hashCiResponse      = __responseHashedByDate(txns.series[1].data )      
    })  

  
    __teardown()
    db.close()
  })    
  beforeExit(function(){            
    assert.equal(2,         __countOn(0, '2010-7-5'))
    assert.equal(1,         __countOn(0, '2010-7-6'))    
    assert.equal(0,         __countOn(0, '2010-7-9'))        
    assert.equal(undefined, __countOn(0, '2009-7-5'))    
    assert.equal(2,         __countOn(1, '2010-7-5'))
    assert.equal(1,         __countOn(1, '2010-7-6'))    
    assert.equal(0,         __countOn(1, '2010-7-9'))        
    assert.equal(undefined, __countOn(1, '2009-7-5'))    
    
  });  
}









function __countOn(seriesIndex, date){
  if (seriesIndex == 0){
    return hashManTxnResponse[date]  
  } else if (seriesIndex == 1) {
    return hashCiResponse[date]      
  }
}









    
