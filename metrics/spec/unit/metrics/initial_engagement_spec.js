describe 'InitialEngagement'
  before_each
    initial_engagement = new ie.Metric()
  end
  
  describe 'getting chart data'
    it 'should return stub data'
      expected_value = {
        "subject_type": "Txn",
        "subject_id": 10,
        "event_name": "created",
        "manual": true
      }
      
      initial_engagement.chartData().should.eql expected_value
    end
    
    it 'should extend base metric'
      initial_engagement.should.be_an_instance_of BaseMetric
    end
  end
end
