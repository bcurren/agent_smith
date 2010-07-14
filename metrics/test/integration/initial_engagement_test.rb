require "/Users/bernd/Sites/outright/config/environment.rb"
require '/Users/bernd/Sites/outright/test/test_helper'

class InitialEngagementTest < ActiveSupport::TestCase
  INITIAL_ENGAGEMENT_URI = "http://localhost:8888?report_name=initial_engagement"
  context "initial engagement test" do
    setup do
      @company_id_seed = 1
      @user_id_seed = 1      
    end
    should "have some cool fixture data" do
      pp fixtures.inspect
    end

  end

private


  def fixtures
    if !@fixtures
      @fixtures = []
      0.upto(30) do |i|
        engaged   = (rand(5) + 1) * 10.0
        unenaged  = (rand(6) + 1) * 10.0
        @fixtures << {
          :date             => i.days.ago, 
          :engaged          => engaged, 
          :unenaged         => unenaged, 
          :engagement_pct   => (engaged / (engaged + unenaged) * 100.0 ),
          :engagement_type  => rand(0) == 0 ? 'CompanyImporter' : 'Txn'
        }
      end
    end
    @fixtures
  end


  def create_user(options)
    company = Factory(
      :company, 
      :name => "Test company: ID #{@company_id_seed}",
      :created_at => options[:date],
      :updated_at => options[:date]
    )
    Factory(
      :user, 
      :email => "testuser#{@user_id_seed}@wherever.com", 
      :company => company,
      :created_at => options[:date],
      :updated_at => options[:date]
    )
    @company_id_seed += 1
    @user_id_seed += 1    
  end
  

end

