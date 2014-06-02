"use strict";
var Errors = {};
function addError(name) {
  Errors[name] = function(line, details) {
    this.line = line;
    this.details = details;
    this.name = name;
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