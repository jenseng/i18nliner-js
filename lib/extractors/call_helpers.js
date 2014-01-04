import pluralize from './pluralize';

var CallHelpers = {
  ALLOWED_PLURALIZATION_KEYS: ["zero", "one", "few", "many", "other"],
  REQUIRED_PLURALIZATION_KEYS: ["one", "other"],
  UNSUPPORTED_EXPRESSION: [],

  normalizeDefault: function(defaultValue, translateOptions) {
    defaultValue = this.inferPluralizationHash(defaultValue, translateOptions);
    if (typeof defaultValue === 'string')
      defaultValue = defaultValue.replace(/^\s+|\s+$/g, "");
    return defaultValue;
  },

  inferPluralizationHash: function(defaultValue, translateOptions) {
    if (typeof defaultValue === 'string' && defaultValue.match(/^[\w-]+$/) && translateOptions && translateOptions.count) {
      return {one: "1 " + defaultValue, other: "%{count} " + pluralize(defaultValue)};
    }
    else {
      return defaultValue;
    }
  },

  isObject: function(object) {
    return typeof object === 'object' && object !== this.UNSUPPORTED_EXPRESSION;
  },

  validDefault: function(allowBlank) {
    var defaultValue = this.defaultValue;
    return allowBlank && (typeof defaultValue === 'undefined' || defaultValue === null) ||
      typeof defaultValue === 'string' ||
      this.isObject(defaultValue);
  },

  inferKey: function(defaultValue, translateOptions) {
    if (this.validDefault(defaultValue)) {
      if (typeof defaultValue === 'object')
        defaultValue = "" + defaultValue.other;
      return this.normalizeDefault(defaultValue, translateOptions);
    }
  },

  /**
   * Possible translate signatures:
   *
   * key [, options]
   * key, default_string [, options]
   * key, default_object, options
   * default_string [, options]
   * default_object, options
   **/
  isKeyProvided: function(keyOrDefault, defaultOrOptions, maybeOptions) {
    if (typeof keyOrDefault === 'object')
      return false;
    if (typeof defaultOrOptions === 'string')
      return true;
    if (maybeOptions)
      return true;
    if (typeof keyOrDefault === 'string' && keyOrDefault.match(/^(\w+\.)+\w+$/))
      return true;
    return false;
  },

  isPluralizationHash: function(object) {
    var keys;
    return this.isObject(object) &&
      (keys = keys(object)) &&
      keys.length > 0 &&
      difference(keys, this.ALLOWED_PLURALIZATION_KEYS) === 0;
  },

  inferArguments: function(args) {
    if (args.length === 2 && typeof args[1] === 'object' && args[1].defaultValue)
      return args;

    var hasKey = this.isKeyProvided.apply(this, args);
    if (!hasKey)
      args.unshift(this.inferKey(args[0]));
    var defaultOrOptions = args[1];
    if (args[2] || typeof defaultOrOptions === 'string' || this.isPluralizationHash(defaultOrOptions)) {
      var options = args[2] = (args[2] || {});
      if (this.isObject(options))
        options.defaultValue = args.splice(1, 1)[0];
    }
    if (args.length === 1)
      args.push({});
    return args;
  }
}

export default CallHelpers;
