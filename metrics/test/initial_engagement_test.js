require.paths.unshift(__dirname + '../lib');
require.paths.unshift(__dirname + '../lib/metrics');
require.paths.unshift(__dirname);
require.paths.unshift(__dirname + '../deps/express/lib')

sys = require('sys'),
fs = require('fs'),
mongo = require('../deps/node-mongodb-native/lib/mongodb'),
svc = require('../lib/service_json');

// require('express');
// require('express/plugins');




db = new mongo.Db('agent_smith_test', new mongo.Server('localhost', 27017, {}), {});

require('../lib/metrics/initial_engagement')
ie = new InitialEngagement
db.open(function(p_db) {
  configure(function(){
    set('root', __dirname);
    set('db', db);
    use(Static);
    use(Cookie);
    use(Logger);
    
    db.close() 
    try {

      exports['test async'] = function(assert, beforeExit){
        var n = 0;
        result = ie.chartData("2010-01-01", function(results){})  
        setTimeout(function(){
            ++n;
            assert.ok(true);
        }, 200);
        setTimeout(function(){
            ++n;
            assert.ok(true);
        }, 200);  
        beforeExit(function(){
          // assert.equal(1, 1, 'this is not right: ' + sys.inspect(result));    
          // assert.equal(1, result, 'this is not right: ' + sys.inspect(result));
        });
      }

    } catch(e) {
      sys.log(sys.inspect(e))
    }










  })
  
})
      