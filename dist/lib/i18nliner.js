"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var fs = _interopRequire(require("fs"));

var I18nliner = {
  ignore: function ignore() {
    var ignores = [];
    if (fs.existsSync(".i18nignore")) {
      ignores = fs.readFileSync(".i18nignore").toString().trim().split(/\r?\n|\r/);
    }
    return ignores;
  },

  set: function set(key, value, fn) {
    var prevValue = this[key];
    this[key] = value;
    if (fn) {
      try {
        fn();
      } finally {
        this[key] = prevValue;
      }
    }
  },

  loadConfig: function loadConfig() {
    if (fs.existsSync(".i18nrc")) {
      try {
        var config = JSON.parse(fs.readFileSync(".i18nrc").toString());
        for (var key in config) {
          if (key === "plugins") {
            this.loadPlugins(config[key]);
          } else {
            this.set(key, config[key]);
          }
        }
      } catch (e) {}
    }
  },

  loadPlugins: function loadPlugins(plugins) {
    plugins.forEach((function (pluginName) {
      require(pluginName)({
        processors: this.Commands.Check.processors
      });
    }).bind(this));
  },

  inferredKeyFormat: "underscored_crc32",
  underscoredKeyLength: 50,
  basePath: "."
};

module.exports = I18nliner;