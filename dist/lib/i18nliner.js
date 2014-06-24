"use strict";
var fs = require("fs")["default"] || require("fs");

var I18nliner = {
  ignore: function() {
    var ignores = [];
    if (fs.existsSync(".i18nignore")) {
      ignores = fs.readFileSync(".i18nignore").toString().trim().split(/\r?\n|\r/);
    }
    this.ignore = function() { return ignores; };
    return this.ignore();
  },
  set: function(key, value, fn) {
    var prevValue = this[key];
    this[key] = value;
    if (fn) {
      try {
        fn();
      }
      finally {
        this[key] = prevValue;
      }
    }
  },
  inferredKeyFormat: 'underscored_crc32',
  underscoredKeyLength: 50,
  basePath: "."
};
exports["default"] = I18nliner;