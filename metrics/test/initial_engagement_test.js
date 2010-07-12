testHelper = require('./test_helper')
ieTestHelper = require('./initial_engagement_test_helper')

exports.initialEngagementTest = function(assert, beforeExit){  
  var chartDataResponse
  db.open(function(p_db){
    __setup()    
    
    //first test
    ie.chartData(function(txns) { 
      chartDataResponse = txns.series[0].data 
    })  

  
    __teardown()
    db.close()
  })    
  beforeExit(function(){            
    var hashedChartDataResponse = __responseHashedByDate(chartDataResponse)
    assert.equal(2, hashedChartDataResponse['2010-7-5'], 'unexpected count for: 2010-7-5: ' + hashedChartDataResponse['2010-7-5'] )
    assert.equal(1, hashedChartDataResponse['2010-7-6'], 'unexpected count for: 2010-7-6: ' + hashedChartDataResponse['2010-7-6'] )    
    assert.equal(0, hashedChartDataResponse['2010-7-9'], 'unexpected count for: 2010-7-9: ' + hashedChartDataResponse['2010-7-9'] )        
    assert.equal(undefined, hashedChartDataResponse['2009-7-5'], 'unexpected count for: 2009-7-5: ' + hashedChartDataResponse['2009-7-5'] )    
  });  
}









// PRIVATE









    
