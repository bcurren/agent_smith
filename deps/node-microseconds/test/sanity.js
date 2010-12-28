var microseconds = require("../lib/node-microseconds"), 
    sys          = require("sys");

// ensure its returning a value!
sys.puts("Milliseconds: " + microseconds.milliseconds());

// compare with setTimeout
sys.puts("Waiting '5000' milliseconds (setTimeout)");
var start = microseconds.milliseconds();
setTimeout(function() {
  var delta = (microseconds.milliseconds() - start);
  require("sys").puts("Actually waited: " + delta + " milliseconds");

  // Environment is sane
  sys.puts("### Environment is sane ###");
}, 5000);
