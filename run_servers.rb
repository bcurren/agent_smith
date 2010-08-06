#!/usr/bin/env ruby
wait_prog          = `find /usr/lib/ruby/user-gems/1.8/gems -name fsevent_sleep`.chomp
spark              = `which spark`.chomp
spark = ENV['SPARK_BIN'] if spark.empty?
unless File.exists?(spark)
  STDERR.print "Not found: '#{spark}'\nYou need to install spark and have its `spark` binary in the path.  \nThat, or point to it in the SPARK_BIN environment variable (currently #{ENV['SPARK_BIN']})\n" 
  exit
end

while true
  puts( "Starting servers...")
  event_server_pid = Kernel.fork {
    Dir.chdir 'event_server' || ( puts "FAIL" ; exit )
    output = exec("#{spark} -p 8000") or puts "failed : #{$?}"
  }
  if event_server_pid
    puts "event server on #{event_server_pid}"
  else
    puts "fork failed: $!"
    exit
  end
  STDERR.print( "waiting for filesystem changes...")
  `#{wait_prog} .`

  STDERR.print( "FS changes detected.  Killing servers...")

  Process.kill( "INT", event_server_pid);
  Process.waitpid(0);
end
