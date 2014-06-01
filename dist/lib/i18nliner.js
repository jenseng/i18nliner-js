"use strict";
var I18nliner = {
  set: function(key, value, fn) {
    var prevValue = this[key];
    this[key] = value;
    if (fn) {
      fn();
      this[key] = prevValue;
    }
  },
  inferredKeyFormat: 'underscored_crc32',
  underscoredKeyLength: 50
};
exports["default"] = I18nliner;