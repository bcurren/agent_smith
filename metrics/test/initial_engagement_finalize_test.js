sys = require('sys')
InitialEngagement = require('../lib/metrics/initial_engagement').Metric
var ie = new InitialEngagement
module.exports = {    
  
    'test finalize method': function(assert){
        assert.deepEqual(__expected_finalize_result, ie.__finalize(__expected_group_result))
    }


}

var __expected_group_result = [ 
  { user_id: '2084271013', date: 'Mon, 05 Jul 2010 14:04:16 -0700', count: 1, txn_created: 'Wed, 07 Jul 2010 14:04:16 -0700', days: 172800000 },
  { user_id: '2084271014', date: 'Sun, 04 Jul 2010 14:04:16 -0700', count: 0, txn_created: 'Fri, 09 Jul 2010 14:04:16 -0700', days: 172800000 },
  { user_id: '2084271015', date: 'Mon, 05 Jul 2010 14:04:16 -0700', count: 1, txn_created: 'Wed, 07 Jul 2010 14:04:16 -0700', days: 172800000 }  
]


var __expected_finalize_result = [ 
  { date: '7/4/2010', count: 0 },
  { date: '7/5/2010', count: 2 }
  
]
