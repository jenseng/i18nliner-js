"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _call_helpers = _interopRequireDefault(require("./call_helpers"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function wordify(string) {
  return string.replace(/[A-Z]/g, function (s) {
    return " " + s.toLowerCase();
  }).trim();
}

var Errors = {
  register: function register(name) {
    this[name] = function (line, details) {
      this.line = line;

      if (details) {
        var parts = [];
        var part;
        if (typeof details === "string" || !details.length) details = [details];

        for (var i = 0; i < details.length; i++) {
          part = details[i];
          part = part === _call_helpers.default.UNSUPPORTED_EXPRESSION ? "<unsupported expression>" : JSON.stringify(part);
          parts.push(part);
        }

        details = parts.join(', ');
      }

      this.name = name;
      this.message = wordify(name) + " on line " + line + (details ? ": " + details : "");
    };
  }
};
Errors.register('InvalidSignature');
Errors.register('InvalidPluralizationKey');
Errors.register('MissingPluralizationKey');
Errors.register('InvalidPluralizationDefault');
Errors.register('MissingInterpolationValue');
Errors.register('MissingCountValue');
Errors.register('InvalidOptionKey');
Errors.register('KeyAsScope');
Errors.register('KeyInUse');
var _default = Errors;
exports.default = _default;
