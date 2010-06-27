describe 'AgentSmith'
  describe '.writePixel'
    it 'outputs a 1x1 tracking pixel to the response'
      var req = new MockRequest("/tracking.gif")
      var res = new MockResponse()
      var agent_smith = new as.AgentSmith(db, function() {})

      agent_smith.writePixel(res)

      res.headers["Content-Length"].should.equal "43"
      res.state.should.equal "closed"
    end
  end

  describe '.serveRequest'
    it 'adds a timestamp to the environment'
      var agent_smith = new as.AgentSmith(db, function() {})
      var req = new MockRequest("http://localhost/t.gif?u=foobar")
      var res = new MockResponse()
      var collection = new MockCollection()

      agent_smith.init(db, function() {
        agent_smith.serveRequest(req, res)

        collection.inserts[0].timestamp.should.be_greater_than 1270000000000
        collection.inserts[0].timestamp.should.be_less_than 1970000000000
      })
    end
  end
end
