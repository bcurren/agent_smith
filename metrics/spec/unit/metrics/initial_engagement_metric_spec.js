describe 'InitialEngagementMetric'
  before_each
    initial_engagement_metric = new ie.InitialEngagementMetric()
  end
  
  describe 'getting chart data'
    it 'should return stub data'
      expected_value = {
        "subject_type": "Txn",
        "subject_id": 10,
        "event_name": "created",
        "manual": true
      }
      
      initial_engagement_metric.chartData().should.eql expected_value
    end
    
    it 'should extend base metric'
      initial_engagement_metric.should.be_an_instance_of BaseMetric
    end
  end
end
