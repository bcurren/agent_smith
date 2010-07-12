// in order to run this test, mongo needs to be running on the default port
// and the metrics server needs to be running on 8888

testHelper = require('./metrics_test_helper')


function setup(){
  request = server.request('GET', '/initial_engagement');
  request.end();
  
  
  
    
}


setup()

runTest("stubbedData", function(){
  console.log(sys.inspect(stubbedEvent(new Date(), new Date())))
})

runTest("Chart data test", function(body){
  assert.equal(1, body)
})












