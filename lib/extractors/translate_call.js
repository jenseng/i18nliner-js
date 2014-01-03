import CallHelpers from './call_helpers';

function difference(a1, a2) {
  var result = [];
  for (var i = 0, len = a1.length; i < len; i++) {
    if (a2.indexOf(a1[i]) === -1)
      result.push(a1[i]);
  }
  return result;
}

function keys(object) {
  var keys = [];
  for (var key in object) {
    if (object.hasOwnProperty(key))
      keys.push(key);
  }
  return keys;
}

function TranslateCall(line, method, args) {
  this.line = line;
  this.method = method;

  this.normalizeArguments(args);

  this.validate();
  this.normalize();
}

TranslateCall.prototype.validate = function() {
  this.validateKey();
  this.validateDefault();
  this.validateOptions();
};

TranslateCall.prototype.normalize = function() {
  this.defaultValue = CallHelpers.normalizeDefault(this.defaultValue, this.options || {});
};

TranslateCall.prototype.translations = function() {
  var key = this.key;
  var defaultValue = this.defaultValue;

  if (!defaultValue)
    return [];
  if (typeof defaultValue === 'string')
    return [[key, defaultValue]];

  var translations = [];
  for (var k in defaultValue) {
    if (defaultValue.hasOwnProperty(k)) {
      translations.push([key + "." + k, defaultValue[k]]);
    }
  }
  return translations;
};

TranslateCall.prototype.validateKey = function() {};

TranslateCall.prototype.validateDefault = function() {
  var defaultValue = this.defaultValue;
  if (typeof defaultValue === 'object') {
    var defaultKeys = keys(defaultValue);
    var dKeys;
    if ((dKeys = difference(defaultKeys, CallHelpers.ALLOWED_PLURALIZATION_KEYS)).length > 0)
      throw "invalid pluralization key(s) on line " + this.line + " (" + dKeys.join(", ") + ")";
    if ((dKeys = difference(CallHelpers.REQUIRED_PLURALIZATION_KEYS, defaultKeys)).length > 0)
      throw "missing pluralization key(s) on line " + this.line + " (" + dKeys.join(", ") + ")";

    for (var k in defaultValue) {
      if (defaultValue.hasOwnProperty(k)) {
        var v = defaultValue[k];
        if (typeof v !== 'string')
          throw "invalid pluralization default on line " + this.line;
        this.validateInterpolationValues(k, v);
      }
    }
  }
  else {
    this.validateInterpolationValues(this.key, this.defaultValue);
  }
};

/**
 * Possible translate signatures:
 *
 * key [, options]
 * key, default_string [, options]
 * key, default_hash, options
 * default_string [, options]
 * default_hash, options
 **/
TranslateCall.prototype.normalizeArguments = function(args) {
  if (!args.length)
    throw "invalid signature on line " + this.line;

  var others = CallHelpers.inferArguments(args);
  var key = this.key = others.shift();
  var options = this.options = others.shift();

  if (others.length)
    throw "invalid signature on line1 " + this.line;
  if (typeof key !== 'string')
    throw "invalid signature on line " + this.line;
  if (options && !CallHelpers.isObject(options))
    throw "invalid signature on line " + this.line;
  if (options) {
    this.defaultValue = options.defaultValue;
    delete options.defaultValue;
  }
  if (!CallHelpers.validDefault(true))
    throw "invalid signature on line " + this.line;
};

TranslateCall.prototype.validateInterpolationValues = function(key, defaultValue) {
  var match;
  var pattern = /%\{([^\}]+)\}/g;
  var options = this.options;
  while (match = pattern.exec(defaultValue)) {
    if (!options[match[1]])
      throw "missing interpolation value on line " + this.line;
  }
};

TranslateCall.prototype.validateOptions = function() {
  var options = this.options;
  if (typeof this.defaultValue === 'object' && (!options || !options.count))
    throw "missing count value on line " + this.line;
  if (options) {
    for (var k in options) {
      if (typeof k !== 'string')
        throw "invalid option key on line " + this.line;
    }
  }
};

export default TranslateCall;
