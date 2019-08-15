"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _errors = _interopRequireDefault(require("../errors"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function TranslationHash() {
  this.translations = {};
}

TranslationHash.prototype.set = function (key, value, meta) {
  var parts = key.split('.');
  var context = this.getScope(parts.slice(0, -1), meta);
  var finalKey = parts[parts.length - 1];

  if (context[finalKey]) {
    if (typeof context[finalKey] === 'object') {
      throw new _errors.default.KeyAsScope(meta.line, key);
    } else if (context[finalKey] !== value) {
      throw new _errors.default.KeyInUse(meta.line, key);
    }
  }

  context[finalKey] = value;
};

TranslationHash.prototype.getScope = function (parts, meta) {
  var context = this.translations;
  var partsLen = parts.length;
  var key;
  var i;

  for (i = 0; i < partsLen; i++) {
    key = parts[i];

    if (typeof context[key] === 'string') {
      throw new _errors.default.KeyAsScope(meta.line, parts.slice(0, i + 1).join("."));
    }

    context = context[key] || (context[key] = {});
  }

  return context;
};

var _default = TranslationHash;
exports.default = _default;
