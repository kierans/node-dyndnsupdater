var extend = require('util')._extend;
var dyndnsupdater = require("../dyndnsupdater");

//noinspection JSUnusedGlobalSymbols
var stubHttp = {
  get: function() {}
};

var defaultOptions = {
  username: "username",
  password: "password",
  hostname: "hostname",
  http: stubHttp
};

var defaultIP = "0.0.0.0";

exports.shouldUseDefaultURLWhenNoneGiven = function(test) {
  dyndnsupdater.updateDynDNS(defaultOptions, defaultIP);

  test.equal(dyndnsupdater.getLastOptionsUsed().url, dyndnsupdater.DEFAULT_URL, "Default URL not used");

  test.done();
};

exports.shouldUseURLGiven = function(test) {
  var URL = "foo";
  var options = extend({ url: URL }, defaultOptions);

  dyndnsupdater.updateDynDNS(options, defaultIP);

  test.equal(dyndnsupdater.getLastOptionsUsed().url, URL, "Given URL not used");

  test.done();
};

exports.shouldThrowErrorWhenNoUsernameGiven = function(test) {
  test.throws(function () {
    dyndnsupdater.updateDynDNS({}, "");
  }, Error, "Username not checked for");

  test.done();
};

exports.shouldThrowErrorWhenNoPasswordGiven = function(test) {
  test.throws(function () {
    dyndnsupdater.updateDynDNS({ username: "" }, "");
  }, Error, "Password not checked for");

  test.done();
};

exports.shouldThrowErrorWhenNoIPGiven = function(test) {
  test.throws(function () {
    dyndnsupdater.updateDynDNS(defaultOptions, undefined);
  }, Error, "IP not checked for");

  test.done();
};

exports.shouldThrowErrorWhenIPNotValid = function(test) {
  test.throws(function () {
    dyndnsupdater.updateDynDNS(defaultOptions, "foo");
  }, Error, "IP not checked for");

  test.done();
};

exports.shouldThrowErrorWhenNoHostnameGiven = function(test) {
  var options = extend({}, defaultOptions);
  delete options.hostname;

  test.throws(function () {
    dyndnsupdater.updateDynDNS(options, defaultIP);
  }, Error, "Host not checked for");

  test.done();
};