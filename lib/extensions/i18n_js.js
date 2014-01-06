import CallHelpers from '../call_helpers';
import Utils from '../utils';

export default function(I18n) {
  var htmlEscape = Utils.htmlEscape;

  I18n.interpolateWithoutHtmlSafety = I18n.interpolate;
  I18n.interpolate = function(message, options) {
    var htmlSafe;
    var needsEscaping = false;
    var matches = message.match(this.PLACEHOLDER);
    var len = matches && matches.length;
    var i;
    var placeholder;
    var name;
    if (options.wrappers) {
      needsEscaping = true;
    }
    else if (matches) {
      for (i = 0; i < len; i++)
        needsEscaping = needsEscaping || (matches[i][1] === 'h');
    }
    if (needsEscaping) {
      message = htmlEscape(message);
      if (matches) {
        for (i = 0; i < len; i++) {
          placeholder = matches[i];
          name = placeholder.replace(this.PLACEHOLDER, "$1");
          if (placeholder[i] !== 'h' && options[name])
            options[name] = htmlEscape(options[name]);
        }
      }
    }
    return this.interpolateWithoutHtmlSafety(message, options);
  };

  // add html-safety hint, i.e. "%h{...}"
  I18n.PLACEHOLDER = /(?:\{\{|%h?\{)(.*?)(?:\}\}?)/gm;

  I18n.translateWithoutI18nliner = I18n.translate;
  I18n.translate = function() {
    var args = CallHelpers.inferArguments([].slice.call(arguments));
    var key = args[0];
    var options = args[1];
    var wrappers = options.wrappers;
    var result;

    result = this.translateWithoutI18nliner(key, options);
    if (wrappers)
      result = CallHelpers.applyWrappers(result, wrappers);
    return result;
  };
  I18n.t = I18n.translate;
}
