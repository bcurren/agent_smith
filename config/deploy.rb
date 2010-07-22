set :application, "agent_smith"
set :user, "release"

set :scm, :git
set :deploy_via, :copy
set :repository, "git@github.com:outright/agent_smith.git"

set :agent_smith_host, "ec2-184-73-153-93.compute-1.amazonaws.com"

role :web, agent_smith_host
role :app, agent_smith_host
role :db,  agent_smith_host

depend :remote, :command, 'git'

set :git_enable_submodules, 1
set :deploy_to, "/var/apps/#{application}"

default_run_options[:pty] = true

namespace :deploy do
  task :restart, :roles => :app, :except => { :no_release => true } do
    run "node #{latest_release}/event_server/server.js"
    run "node #{latest_release}/metrics/server.js"
  end

  task :pull_submodules, :roles => :app do    
    run "cd #{latest_release}/event_server/deps/node-mongodb-native && git submodule update --init"    
    run "cd #{latest_release}/metrics/deps/express && git submodule update --init"    
    run "cd #{latest_release}/metrics/deps/node-mongodb-native && git submodule update --init"        
  end
end


after 'deploy:update_code', 'deploy:pull_submodules'
