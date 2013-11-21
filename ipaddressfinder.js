var http = require("http");
var cheerio = require("cheerio");
var events = require("events");

var IPAddressFinder = new events.EventEmitter();

IPAddressFinder.getCurrentIPAddress = function() {
  var html = "";

  var self = this;

  console.log("Determining public facing IP ...");

  var request = http.request("http://whatismyipaddress.com", function(response) {
    response.on("data", function (chunk) {
      html += chunk;
    });

    response.on("end", function() {
      //console.log(html);

      var jq = cheerio.load(html);

      var nodes = jq("#section_left").children();
      nodes = jq(nodes[2]).text();

      var ip = nodes.trim();

      console.log("Public facing IP is: '" + ip + "'");

      self.emit("ipfound", ip);
    });
  });

  request.on("error", function(e) {
    console.error("There was problem with requesting you current public IP address: " + e.message);
  });

  request.end();
};

module.exports = IPAddressFinder;