// in order to run this test, mongo needs to be running on the default port
// and the metrics server needs to be running on 8888

metricsTestHelper = require('./metrics_test_helper')

mongo = require('../../../deps/node-mongodb-native/lib/mongodb')
db = new mongo.Db('agent_smith', new mongo.Server('localhost', 27017, {}), {});


process.addListener('setupDone', function(){
  sys.log('setup done')
  runTest()
})


process.addListener('testsDone', function(){
  sys.log('tests done')
  tearDown()
})

runSuite()

function runSuite(){
  db.open(function(p_db){  
    db.collection('events', function(err, collection){
      collection.insert(
        [
          txnFixture(daysAgo(20),  daysAgo(1)), // 19 days between user created and txn - ng!
          txnFixture(daysAgo(15),  daysAgo(1)),          
          txnFixture(daysAgo(4),   daysAgo(4)),
          txnFixture(daysAgo(4),   daysAgo(4)),
          txnFixture(daysAgo(4),   daysAgo(4)),
          txnFixture(daysAgo(4),   daysAgo(4)),          
          txnFixture(daysAgo(3),   daysAgo(3)),                    
          txnFixture(daysAgo(3),   daysAgo(3)),                    
          txnFixture(daysAgo(3),   daysAgo(3)),           
          txnFixture(daysAgo(2),   daysAgo(2)),                                                  
          txnFixture(daysAgo(2),   daysAgo(2)),                     
          txnFixture(daysAgo(1),   daysAgo(1)),               
          ciFixture(daysAgo(20),   daysAgo(20)),                         
          ciFixture(daysAgo(20),   daysAgo(20)),                                   
          ciFixture(daysAgo(21),   daysAgo(1))                                   
        ], 
        function(err, ids){
        process.emit('setupDone')
      })      
    })    
  })  
}

function runTest(){
  inRequestContext(function(body){
    assertDateHasCount(body, 0, daysAgo(20), 0)
    assertDateHasCount(body, 0, daysAgo(15), 0)    
    assertDateHasCount(body, 0, daysAgo(4), 4)
    assertDateHasCount(body, 0, daysAgo(3), 3)
    assertDateHasCount(body, 0, daysAgo(2), 2)    
    assertDateHasCount(body, 0, daysAgo(1), 1)    
    assertDateHasCount(body, 1, daysAgo(20), 2)        
    assertDateHasCount(body, 1, daysAgo(21), 0)            
  })
}

function assertDateHasCount(body, series, date, count){
  seriesZeroData = hashByDate(body.series[series].data)        
  assert.equal(seriesZeroData[formattedDate(date)], count)    
}

function inRequestContext(callback){
  request = server.request('GET', '/initial_engagement');
  request.end();    
  request.addListener('response', function (response) {
    response.setEncoding('utf8');
    response.addListener('data', function (body) {
      try {
        callback(JSON.parse(body))
        sys.log('yee hawww')
      } catch (err) {
        sys.log('yer bummin: ' + sys.inspect(err))
      }    
      process.emit('testsDone')      
    });
  });  
  
}

function tearDown(){
  sys.log('tearing down')  
  db.collection('events', function(err, collection){
    collection.remove(function(err, collection){})      
  })
  db.close()
  
}



