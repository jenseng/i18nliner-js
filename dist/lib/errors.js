"use strict";
var CallHelpers = require("./call_helpers")["default"] || require("./call_helpers");

function wordify(string) {
  return string.replace(/[A-Z]/g, function(s) {
    return " " + s.toLowerCase();
  }).trim();
}

var Errors = {};
function addError(name) {
  Errors[name] = function(line, details) {
    this.line = line;
    if (details) {
      var parts = [];
      var part;
      if (typeof details === "string" || !details.length) details = [details];
      for (var i = 0; i < details.length; i++) {
        part = details[i];
        part = part === CallHelpers.UNSUPPORTED_EXPRESSION ?
          "<unsupported expression>" :
          JSON.stringify(part);
        parts.push(part);
      }
      details = parts.join(', ');
    }
    this.name = name;
    this.message = wordify(name) + " on line " + line + (details ? ": " + details : "");
  };
}

addError('InvalidSignature');
addError('InvalidPluralizationKey');
addError('MissingPluralizationKey');
addError('InvalidPluralizationDefault');
addError('MissingInterpolationValue');
addError('MissingCountValue');
addError('InvalidOptionKey');
addError('KeyAsScope');
addError('KeyInUse');

exports["default"] = Errors;