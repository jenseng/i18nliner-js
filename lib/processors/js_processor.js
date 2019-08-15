import fs from "fs";
import { parse } from "@babel/parser";
import AbstractProcessor from "./abstract_processor";
import I18nJsExtractor from "../extractors/i18n_js_extractor";
import I18nliner from '../i18nliner';

function JsProcessor(translations, options) {
  AbstractProcessor.call(this, translations, options);
}

JsProcessor.prototype = Object.create(AbstractProcessor.prototype);
JsProcessor.prototype.constructor = JsProcessor;
JsProcessor.prototype.defaultPattern = "**/*.js";
JsProcessor.prototype.I18nJsExtractor = I18nJsExtractor;

JsProcessor.prototype.checkContents = function(source) {
  var fileData = this.preProcess(source);
  if (fileData.skip) return;
  fileData.ast = fileData.ast || this.parse(fileData.source);
  var extractor = new this.I18nJsExtractor(fileData);
  extractor.forEach(function(key, value, meta) {
    this.translations.set(key, value, meta);
    this.translationCount++;
  }.bind(this));
};

JsProcessor.prototype.sourceFor = function(file) {
  return fs.readFileSync(file).toString();
};

JsProcessor.prototype.parse = function(source) {
  return parse(source, { plugins: I18nliner.config.babylonPlugins, sourceType: "module" });
};

JsProcessor.prototype.preProcess = function(source) {
  return {
    source: source,
    skip: !source.match(/I18n\.t/)
  };
};

export default JsProcessor;
