var http = require("http");
var events = require("events");

var IPAddressFinder = new events.EventEmitter();

IPAddressFinder.getCurrentIPAddress = function() {
  function logError(e) {
    console.error("There was problem with requesting you current public IP address: " + e.message);
  }

  var regexp = /Current IP Address: (\d+\.\d+.\d+.\d+)/;
  var html = "";

  var self = this;

  console.log("Determining public facing IP ...");

  var request = http.request("http://checkip.dyndns.org/", function(response) {
    response.on("data", function (chunk) {
      html += chunk;
    });

    response.on("end", function() {
      //console.log(html);

      var matches = regexp.exec(html);
      var ip = matches[1];

      if (ip === undefined) {
        logError(new Error("IP regexp didn't match"));
        return;
      }

      console.log("Public facing IP is: '" + ip + "'");

      self.emit("ipfound", ip);
    });
  });

  request.on("error", function(e) {
    logError(e);
  });

  request.end();
};

module.exports = IPAddressFinder;