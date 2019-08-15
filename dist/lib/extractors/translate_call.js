"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _call_helpers = _interopRequireDefault(require("../call_helpers"));

var _errors = _interopRequireDefault(require("../errors"));

var _utils = _interopRequireDefault(require("../utils"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function TranslateCall(line, method, args) {
  this.line = line;
  this.method = method;
  this.normalizeArguments(args);
  this.validate();
  this.normalize();
}

_utils.default.extend(TranslateCall.prototype, _call_helpers.default);

TranslateCall.prototype.validate = function () {
  this.validateKey();
  this.validateDefault();
  this.validateOptions();
};

TranslateCall.prototype.normalize = function () {
  this.defaultValue = this.normalizeDefault(this.defaultValue, this.options || {});
};

TranslateCall.prototype.translations = function () {
  var key = this.key;
  var defaultValue = this.defaultValue;
  if (!defaultValue) return [];
  if (typeof defaultValue === 'string') return [[key, defaultValue]];
  var translations = [];

  for (var k in defaultValue) {
    if (defaultValue.hasOwnProperty(k)) {
      translations.push([key + "." + k, defaultValue[k]]);
    }
  }

  return translations;
};

TranslateCall.prototype.validateKey = function () {};

TranslateCall.prototype.validateDefault = function () {
  var defaultValue = this.defaultValue;

  if (typeof defaultValue === 'object') {
    var defaultKeys = _utils.default.keys(defaultValue);

    var dKeys;
    if ((dKeys = _utils.default.difference(defaultKeys, this.ALLOWED_PLURALIZATION_KEYS)).length > 0) throw new _errors.default.InvalidPluralizationKey(this.line, dKeys);
    if ((dKeys = _utils.default.difference(this.REQUIRED_PLURALIZATION_KEYS, defaultKeys)).length > 0) throw new _errors.default.MissingPluralizationKey(this.line, dKeys);

    for (var k in defaultValue) {
      if (defaultValue.hasOwnProperty(k)) {
        var v = defaultValue[k];
        if (typeof v !== 'string') throw new _errors.default.InvalidPluralizationDefault(this.line);
        this.validateInterpolationValues(k, v);
      }
    }
  } else {
    this.validateInterpolationValues(this.key, this.defaultValue);
  }
};
/**
 * Possible translate signatures:
 *
 * key [, options]
 * key, default_string [, options]
 * key, default_object, options
 * default_string [, options]
 * default_object, options
 **/


TranslateCall.prototype.normalizeArguments = function (args) {
  if (!args.length) throw new _errors.default.InvalidSignature(this.line, args);
  var others = this.inferArguments(args.slice(), this);
  var key = this.key = others.shift();
  var options = this.options = others.shift();
  if (others.length) throw new _errors.default.InvalidSignature(this.line, args);
  if (typeof key !== 'string') throw new _errors.default.InvalidSignature(this.line, args);
  if (options && !this.isObject(options)) throw new _errors.default.InvalidSignature(this.line, args);

  if (options) {
    this.defaultValue = options.defaultValue;
    delete options.defaultValue;
  }

  if (!this.validDefault(true)) throw new _errors.default.InvalidSignature(this.line, args);
};

TranslateCall.prototype.validateInterpolationValues = function (key, defaultValue) {
  var match;
  var pattern = /%\{([^\}]+)\}/g;
  var options = this.options;
  var placeholder;

  while ((match = pattern.exec(defaultValue)) !== null) {
    placeholder = match[1];
    if (!(placeholder in options)) throw new _errors.default.MissingInterpolationValue(this.line, placeholder);
  }
};

TranslateCall.prototype.validateOptions = function () {
  var options = this.options;
  if (typeof this.defaultValue === 'object' && (!options || !options.count)) throw new _errors.default.MissingCountValue(this.line);

  if (options) {
    for (var k in options) {
      if (typeof k !== 'string') throw new _errors.default.InvalidOptionKey(this.line);
    }
  }
};

var _default = TranslateCall;
exports.default = _default;
