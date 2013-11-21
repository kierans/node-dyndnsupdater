var opt = require("node-getopt").create([
  ["u", "username=ARG", "username"],
  ["p", "password=ARG", "password"],
  ["H" , "hostname=ARG", "hostname"],
  ["h" , "help", "display this help"]
]);

opt.bindHelp().parseSystem();

module.exports = {
  getDynDNSUpdaterOptions: function() {
    return opt.parsedOption.options;
  }
};
