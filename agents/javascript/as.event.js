AS = {};

(function() {

// e.g. new EventTracker("http://localhost:8000")
AS.Event = function(server) {
  this.server = server;
};

AS.Event.prototype.track = function(env) {
  var img = document.createElement("img");
  img.setAttribute("src", this.server + "/tracking.gif?" + this._jsonToParams(env));
  document.body.appendChild(img);
};

AS.Event.prototype._jsonToParams = function(env) {
  var params = [];
  for (var key in env) {
    params.push(encodeURIComponent(key) + "=" + encodeURIComponent(env[key]));
  }
  return params.join("&");
}

})();
