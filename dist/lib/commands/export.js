"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _fs = _interopRequireDefault(require("fs"));

var _mkdirp = _interopRequireDefault(require("mkdirp"));

var _check = _interopRequireDefault(require("./check"));

var _i18nliner = _interopRequireDefault(require("../../lib/i18nliner"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Export(options) {
  _check.default.call(this, options);
}

Export.prototype = Object.create(_check.default.prototype);
Export.prototype.constructor = Export;

Export.prototype.run = function () {
  var success = _check.default.prototype.run.call(this);

  var locale = 'en';
  var translations = {};
  translations[locale] = this.translations.translations;
  this.outputFile = _i18nliner.default.config.basePath + '/' + (this.options.outputFile || "config/locales/generated/" + locale + ".json");

  _mkdirp.default.sync(this.outputFile.replace(/\/[^\/]+$/, ''));

  if (success) {
    _fs.default.writeFileSync(this.outputFile, JSON.stringify(translations));

    this.print("Wrote default translations to " + this.outputFile + "\n");
  }

  return success;
};

var _default = Export;
exports.default = _default;
