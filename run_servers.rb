#!/usr/bin/env ruby
wait_prog_dir = `gem which autotest/fsevent`.chomp
wait_prog = wait_prog_dir.sub(/(.*)lib.*/, '\1bin/fsevent_sleep')
# wait_prog          = `find /usr/lib/ruby/user-gems/1.8/gems -name fsevent_sleep`.chomp
spark              = `which spark`.chomp
spark = ENV['SPARK_BIN'] if spark.empty?
unless spark && File.exists?("/#{spark}")
  STDERR.print "Not found: '#{spark}'\nYou need to install spark and have the absolute path to its bin/ directory in the path.  \nThat, or point to it in the SPARK_BIN environment variable (currently #{ENV['SPARK_BIN']})\n" 
  exit
end

killing = 0

started_mongo = false
STDOUT.print "Checking for running Mongo DB..."
unless system( "echo hi | mongo 2>/dev/null 1>&2" )
  puts "not found."
  puts "Mongo DB is not running.  Trying to start...\n\n# mongod --fork --logpath ~/mongo.log"
  unless system( "mongod --fork --logpath ~/mongo.log" ) 
    puts "fatal: Failed to start Mongo DB."
    exit
  end
  started_mongo = true
else
  puts "found."
end

while killing < 2
  puts( "Starting event server...")
  event_server_pid = Kernel.fork {
    Dir.chdir 'event_server' || ( puts "FAIL" ; exit )
    output = exec("#{spark} -p 8000") or puts "failed : #{$?}"
    exit
  }
  if event_server_pid
    puts "event server reported on #{event_server_pid}"
  end
  STDERR.print( "waiting for filesystem...")
  if system("#{wait_prog} .") 
    puts( "change detected." )
    system("date")
    killing = 0
  else
    if $? == 2
      if killing != 0
        puts "Got second interrupt, quitting."
      end
      killing += 1
    else
      puts "Error #{$?} trying to wait for fs changes (#{wait_prog}).  Try doing:\n\tgem install autotest-fsevent"
      exit
    end
  end
  if killing == 1
    puts "\n\nGot interrupt, forcing restart.  Again to exit.\n\n"
  else
    puts( "Stopping event server...")
  end
  Process.kill( "INT", event_server_pid);
  Process.waitpid(0);
end
if started_mongo
  puts "Stopping Mongo DB..."
  system("killall mongod")
end
puts