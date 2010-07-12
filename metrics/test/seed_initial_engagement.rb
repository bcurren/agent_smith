require "/Users/bernd/Sites/outright/config/environment.rb"
Txn.all.each{|t| t.destroy!}
User.all.each{|u| u.destroy!}
Company.all.each{|c| c.destroy!}
CompanyImporter.all.each{|c| c.destroy!}

def factory_user(created_at)    
  Factory(
    :user, 
    :company => Factory(
      :company, 
      :created_at => created_at, 
      :updated_at => created_at
    ), 
    :created_at => created_at
  )
end

def factory_txn(user, created_at, manual)
  Factory(
    :txn, 
    :company => user.company, 
    :created_at => created_at, 
    :updated_at => created_at, 
    :company_importer_id => manual ? nil : rand(200)
  )
end


def factory_ci(user, created_at)
  Factory(
    :company_importer, 
    :company => user.company, 
    :created_at => created_at, 
    :updated_at => created_at
  )
end


def create_initial_engagement_txns
  1.upto(10) do |i|
    rand(3).times do 
      u = factory_user(i.days.ago)
      factory_txn(u, i.days.ago, true)
    end
  end
end

def create_initial_engagement_cis
  1.upto(10) do |i|
    rand(3).times do
      u = factory_user(i.days.ago)    
      factory_ci(u, i.days.ago)    
    end
  end
end


def create_10_manual_txns_that_dont_qualify
  1.upto(10) do |i|
    u = factory_user((i + 10).days.ago)
    factory_txn(u, u.created_at + 4.days, true)
  end
end


def create_10_cis_that_dont_qualify
  1.upto(10) do |i|
    u = factory_user((i + 10).days.ago)
    factory_ci(u, u.created_at + 4.days)
  end
end


def create_15_imported_txns
  1.upto(15) do |i|
    u = factory_user((i).days.ago)
    factory_txn(u, (i - 1).days.ago, false)
  end
end


create_initial_engagement_txns
create_initial_engagement_cis
create_10_manual_txns_that_dont_qualify
create_10_cis_that_dont_qualify
create_15_imported_txns

