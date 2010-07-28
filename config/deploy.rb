set :application, "agent_smith"
set :user, "release"

set :scm, :git
set :deploy_via, :remote_cache
set :git_shallow_clone, 1
# set :git_enable_submodules, 1
default_run_options[:pty] = true

set :use_sudo, false
set :repository, "git@github.com:outright/agent_smith.git"

role :web, "ec2-184-73-153-93.compute-1.amazonaws.com"
role :app, "ec2-184-73-153-93.compute-1.amazonaws.com"

depend :remote, :command, 'git'

set :git_enable_submodules, 1
set :deploy_to, "/var/apps/#{application}"

default_run_options[:pty] = true

namespace :deploy do
  task :restart, :roles => :app, :except => { :no_release => true } do
    # sudo "killall node"
    sudo "/etc/init.d/event_server start"
  end
  
  task :pull_submodules, :roles => :app do
    run "cd #{latest_release} && git submodule --quiet update --init --recursive"
  end
  
  task :config_symlink do
    run "ln -nfs #{shared_path}/metrics/config/app.json #{latest_release}/metrics/config/app.json"
    run "ln -nfs #{shared_path}/event_server/config/app.json #{latest_release}/event_server/config/app.json"
  end
end

after 'deploy:update_code', 'deploy:pull_submodules'
after 'deploy:update_code', 'deploy:config_symlink'
