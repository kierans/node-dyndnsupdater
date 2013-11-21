#! /usr/bin/env node

var ipaddressfinder = require("./ipaddressfinder");
var dyndnsUpdater = require("./dyndnsupdater");

var options = require("./getopts").getDynDNSUpdaterOptions();

dyndnsUpdater.on("success", function(newIP) {
  console.log("IP Address changed to: '" + newIP + "'");
});

dyndnsUpdater.on("error", function(message) {
  console.error("Error from DynDNS: '" + message + "'");
});

ipaddressfinder.on("ipfound", function(ip) {
  console.log("Updating DynDNS ....");

  try {
    dyndnsUpdater.updateDynDNS(options, ip);
  }
  catch(error) {
    console.error("There was an error invoking DynDNSUpater: '" + error + "' (see help)");
  }
});

ipaddressfinder.getCurrentIPAddress();

