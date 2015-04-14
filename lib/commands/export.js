import fs from "fs";
import mkdirp from "mkdirp";
import Check from "./check";
import I18nliner from '../../lib/i18nliner';

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
  this.outputFile = I18nliner.config.basePath + '/' + (this.options.outputFile || "config/locales/generated/" + locale + ".json");
  mkdirp.sync(this.outputFile.replace(/\/[^\/]+$/, ''));
  if (success) {
    fs.writeFileSync(this.outputFile, JSON.stringify(translations));
    this.print("Wrote default translations to " + this.outputFile + "\n");
  }
  return success;
};

export default Export;
