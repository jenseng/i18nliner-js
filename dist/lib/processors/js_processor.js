"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _fs = _interopRequireDefault(require("fs"));

var _parser = require("@babel/parser");

var _abstract_processor = _interopRequireDefault(require("./abstract_processor"));

var _i18n_js_extractor = _interopRequireDefault(require("../extractors/i18n_js_extractor"));

var _i18nliner = _interopRequireDefault(require("../i18nliner"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function JsProcessor(translations, options) {
  _abstract_processor.default.call(this, translations, options);
}

JsProcessor.prototype = Object.create(_abstract_processor.default.prototype);
JsProcessor.prototype.constructor = JsProcessor;
JsProcessor.prototype.defaultPattern = "**/*.js";
JsProcessor.prototype.I18nJsExtractor = _i18n_js_extractor.default;

JsProcessor.prototype.checkContents = function (source) {
  var fileData = this.preProcess(source);
  if (fileData.skip) return;
  fileData.ast = fileData.ast || this.parse(fileData.source);
  var extractor = new this.I18nJsExtractor(fileData);
  extractor.forEach(function (key, value, meta) {
    this.translations.set(key, value, meta);
    this.translationCount++;
  }.bind(this));
};

JsProcessor.prototype.sourceFor = function (file) {
  return _fs.default.readFileSync(file).toString();
};

JsProcessor.prototype.parse = function (source) {
  return (0, _parser.parse)(source, {
    plugins: _i18nliner.default.config.babylonPlugins,
    sourceType: "module"
  });
};

JsProcessor.prototype.preProcess = function (source) {
  return {
    source: source,
    skip: !source.match(/I18n\.t/)
  };
};

var _default = JsProcessor;
exports.default = _default;
