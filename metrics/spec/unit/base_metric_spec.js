describe 'BaseMetric'
  before_each
    base_metric = new bm.BaseMetric()
  end
  
  describe 'interface'
    it 'should be able to get chard data'
      base_metric.should.respond_to("chartData")
    end
    
    it 'should raise an exception'
      base_metric.chartData.should.throw_error 'Method not implemented!'
    end
  end
end
