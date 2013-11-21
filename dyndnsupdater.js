/*
 * Based on https://github.com/kersten/node-dyndns-client
 *
 * Problem with that client is that it loops forever.
 */
var events = require("events");
var extend = require('util')._extend;
var url = require("url");

var DEFAULT_OPTIONS = {
  url: "https://[USERNAME]:[PASSWORD]@members.dyndns.org/nic/update?hostname=[HOSTNAME]&myip=[IP]"
};

function checkOptions(options) {
  if (options.username === undefined) {
    throw new Error("Username is undefined");
  }

  if (options.password === undefined) {
    throw new Error("Password is undefined");
  }

  if (options.hostname === undefined) {
    throw new Error("Hostname is undefined");
  }
}

function checkURL(options) {
  if (options.url === undefined) {
    options.url = DEFAULT_OPTIONS.url;
  }
}

function checkIP(ip) {
  var ipPattern = new RegExp(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/);

  if (ip === undefined) {
    throw new Error("IP is undefined");
  }

  if (!ip.match(ipPattern)) {
    throw new Error("IP isn't correct format");
  }
}

function processData(ip, data, outer) {
  switch (data.toString().split(" ")[0]) {
    case "badauth":
      outer.emit("error", "Bad username or password.");
      break;

    case "notfqdn":
      outer.emit("error",
          "The hostname specified is not a fully-qualified domain name (not in the form hostname.dyndns.org or domain.com).");
      break;

    case "nohost":
      outer.emit("error",
          "The hostname specified does not exist in this user account (or is not in the service specified in the system parameter).");
      break;

    case "numhost":
      outer.emit("error",
          "Too many hosts (more than 20) specified in an update. Also returned if trying to update a round robin (which is not allowed).");
      break;

    case "abuse":
      outer.emit("error", "The hostname specified is blocked for update abuse.");
      break;

    case "dnserr":
    case "911":
      outer.emit("error", "Bad username or password.");
      break;

    case "good":
    case "nochg":
      outer.emit("success", ip);
      break;
  }
}

var DynDNSUpdater = new events.EventEmitter();

DynDNSUpdater.updateDynDNS = function(options, ip) {
  this.options = extend({}, options);

  checkURL(this.options);
  checkOptions(this.options);
  checkIP(ip);

  var self = this,
      service = url.parse(this.options.url
          .replace("[USERNAME]", this.options.username)
          .replace("[PASSWORD]", this.options.password)
          .replace("[IP]", ip)
          .replace("[HOSTNAME]", this.options.hostname)
      );

  var http = options.http || require("http");

  var httpOptions = {
    host: service.hostname,
    port: service.port,
    path: service.path,
    headers: {
      "User-Agent": "dyndnsupdater - a dyndns updater"
    },
    auth: service.auth
  };

  http.get(httpOptions, function(response) {
    response.on('data', function (data) {
      processData(ip, data, self);
    });

    response.on("error", function (error) {
      self.emit("error", "Some HTTP error occurred during IP update: " + error.toString());
    });
  });
};

DynDNSUpdater.getLastOptionsUsed = function() {
  return this.options;
};

module.exports = DynDNSUpdater;
module.exports.DEFAULT_URL = DEFAULT_OPTIONS.url;