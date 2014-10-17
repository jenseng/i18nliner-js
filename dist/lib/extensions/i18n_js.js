"use strict";
var CallHelpers = require("../call_helpers")["default"] || require("../call_helpers");
var Utils = require("../utils")["default"] || require("../utils");

var extend = function(I18n) {
  var htmlEscape = Utils.htmlEscape;

  I18n.HtmlSafeString = Utils.HtmlSafeString;

  I18n.interpolateWithoutHtmlSafety = I18n.interpolate;
  I18n.interpolate = function(message, options) {
    var needsEscaping = false;
    var matches = message.match(this.PLACEHOLDER) || [];
    var len = matches.length;
    var match;
    var keys = [];
    var key;
    var i;

    if (options.wrappers)
      needsEscaping = true;

    for (i = 0; i < len; i++) {
      match = matches[i];
      key = match.replace(this.PLACEHOLDER, "$1");
      keys.push(key);
      if (!(key in options)) continue;
      if (match[1] === 'h')
        options[key] = new I18n.HtmlSafeString(options[key]);
      if (options[key] instanceof I18n.HtmlSafeString)
        needsEscaping = true;
    }

    if (needsEscaping) {
      message = htmlEscape(message);
      for (i = 0; i < len; i++) {
        key = keys[i];
        if (!(key in options)) continue;
        options[key] = htmlEscape(options[key]);
      }
    }
    return this.interpolateWithoutHtmlSafety(message, options);
  };

  // add html-safety hint, i.e. "%h{...}"
  I18n.PLACEHOLDER = /(?:\{\{|%h?\{)(.*?)(?:\}\}?)/gm;

  I18n.CallHelpers = CallHelpers;

  I18n.translateWithoutI18nliner = I18n.translate;
  I18n.translate = function() {
    var args = CallHelpers.inferArguments([].slice.call(arguments));
    var key = args[0];
    var options = args[1];
    key = CallHelpers.normalizeKey(key, options);
    var defaultValue = options.defaultValue;
    if (defaultValue)
      options.defaultValue = CallHelpers.normalizeDefault(defaultValue, options);
    var wrappers = options.wrappers;
    var result;

    result = this.translateWithoutI18nliner(key, options);
    if (wrappers)
      result = CallHelpers.applyWrappers(result, wrappers);
    return result;
  };
  I18n.t = I18n.translate;
};

exports["default"] = extend;