server = require('../server')
module.exports = {
  'test get /report_name': function(assert){
    assert.response(server, {
      url: '/',
      method: 'GET'
    },{
      body: '{"name":"tj"}',
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf8'
      }
    });
  }
}