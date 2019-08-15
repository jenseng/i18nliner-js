"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _call_helpers = _interopRequireDefault(require("../call_helpers"));

var _utils = _interopRequireDefault(require("../utils"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var extend = function extend(I18n) {
  var htmlEscape = _utils.default.htmlEscape;
  I18n.interpolateWithoutHtmlSafety = I18n.interpolate;

  I18n.interpolate = function (message, options) {
    var needsEscaping = false;
    var matches = message.match(this.PLACEHOLDER) || [];
    var len = matches.length;
    var match;
    var keys = [];
    var key;
    var i;
    var wrappers = options.wrappers || options.wrapper;

    if (wrappers) {
      needsEscaping = true;
      message = htmlEscape(message);
      message = _call_helpers.default.applyWrappers(message, wrappers);
    }

    for (i = 0; i < len; i++) {
      match = matches[i];
      key = match.replace(this.PLACEHOLDER, "$1");
      keys.push(key);
      if (!(key in options)) continue;
      if (match[1] === 'h') options[key] = new _utils.default.HtmlSafeString(options[key]);
      if (options[key] instanceof _utils.default.HtmlSafeString) needsEscaping = true;
    }

    if (needsEscaping) {
      if (!wrappers) message = htmlEscape(message);

      for (i = 0; i < len; i++) {
        key = keys[i];
        if (!(key in options)) continue;
        options[key] = htmlEscape(options[key]);
      }
    }

    message = this.interpolateWithoutHtmlSafety(message, options);
    return needsEscaping ? new _utils.default.HtmlSafeString(message) : message;
  }; // add html-safety hint, i.e. "%h{...}"


  I18n.PLACEHOLDER = /(?:\{\{|%h?\{)(.*?)(?:\}\}?)/gm;
  I18n.CallHelpers = _call_helpers.default;
  I18n.Utils = _utils.default;
  I18n.translateWithoutI18nliner = I18n.translate;

  I18n.translate = function () {
    var args = _call_helpers.default.inferArguments([].slice.call(arguments));

    var key = args[0];
    var options = args[1];
    key = _call_helpers.default.normalizeKey(key, options);
    var defaultValue = options.defaultValue;
    if (defaultValue) options.defaultValue = _call_helpers.default.normalizeDefault(defaultValue, options);
    return this.translateWithoutI18nliner(key, options);
  };

  I18n.t = I18n.translate;
};

var _default = extend;
exports.default = _default;
