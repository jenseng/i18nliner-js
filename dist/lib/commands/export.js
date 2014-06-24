"use strict";
var fs = require("fs")["default"] || require("fs");
var mkdirp = require("mkdirp")["default"] || require("mkdirp");
var Check = require("./check")["default"] || require("./check");
var I18nliner = require("../../lib/i18nliner")["default"] || require("../../lib/i18nliner");

function Export(options) {
  Check.call(this, options);
}

Export.prototype = Object.create(Check.prototype);
Export.prototype.constructor = Export;

Export.prototype.run = function() {
  var success = Check.prototype.run.call(this);
  var locale = 'en';
  var translations = {};
  translations[locale] = this.translations.translations;
  this.outputFile = I18nliner.basePath + '/' + (this.options.outputFile || "config/locales/generated/" + locale + ".json");
  mkdirp.sync(this.outputFile.replace(/\/[^\/]+$/, ''));
  if (success) {
    fs.writeFileSync(this.outputFile, JSON.stringify(translations));
    this.print("Wrote default translations to " + this.outputFile);
  }
  return success;
};

exports["default"] = Export;