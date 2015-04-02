"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var fs = _interopRequire(require("fs"));

var mkdirp = _interopRequire(require("mkdirp"));

var Check = _interopRequire(require("./check"));

var I18nliner = _interopRequire(require("../../lib/i18nliner"));

function Export(options) {
  Check.call(this, options);
}

Export.prototype = Object.create(Check.prototype);
Export.prototype.constructor = Export;

Export.prototype.run = function () {
  var success = Check.prototype.run.call(this);
  var locale = "en";
  var translations = {};
  translations[locale] = this.translations.translations;
  this.outputFile = I18nliner.basePath + "/" + (this.options.outputFile || "config/locales/generated/" + locale + ".json");
  mkdirp.sync(this.outputFile.replace(/\/[^\/]+$/, ""));
  if (success) {
    fs.writeFileSync(this.outputFile, JSON.stringify(translations));
    this.print("Wrote default translations to " + this.outputFile + "\n");
  }
  return success;
};

module.exports = Export;