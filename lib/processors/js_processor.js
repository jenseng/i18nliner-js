import fs from "fs";
import AbstractProcessor from "./abstract_processor";
import I18nJsExtractor from "../extractors/i18n_js_extractor";

function JsProcessor(translations, options) {
  AbstractProcessor.call(this, translations, options);
}

JsProcessor.prototype = Object.create(AbstractProcessor.prototype);
JsProcessor.prototype.constructor = JsProcessor;
JsProcessor.prototype.defaultPattern = "**/*.js";

JsProcessor.prototype.checkContents = function(source) {
  var extractor = new I18nJsExtractor({source: this.preProcess(source)});
  extractor.forEach(function(key, value) {
    this.translations.set(key, value);
    this.translationCount++;
  }.bind(this));
};

JsProcessor.prototype.sourceFor = function(file) {
  return fs.readFileSync(file);
};

JsProcessor.prototype.preProcess = function(source) {
  return source;
};

export default JsProcessor;
