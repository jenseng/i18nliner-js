"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _cliColor = _interopRequireDefault(require("cli-color"));

var _translation_hash = _interopRequireDefault(require("../extractors/translation_hash"));

var _generic_command = _interopRequireDefault(require("./generic_command"));

var _js_processor = _interopRequireDefault(require("../processors/js_processor"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var red = _cliColor.default.red;
var green = _cliColor.default.green;

function sum(array, prop) {
  var total = 0;

  for (var i = 0, len = array.length; i < len; i++) {
    total += array[i][prop];
  }

  return total;
}

function Check(options) {
  _generic_command.default.call(this, options);

  this.errors = [];
  this.translations = new this.TranslationHash();
  this.setUpProcessors();
}

Check.prototype = Object.create(_generic_command.default.prototype);
Check.prototype.constructor = Check;
Check.prototype.TranslationHash = _translation_hash.default;

Check.prototype.setUpProcessors = function () {
  this.processors = [];

  for (var key in Check.processors) {
    var Processor = Check.processors[key];
    this.processors.push(new Processor(this.translations, {
      translations: this.translations,
      checkWrapper: this.checkWrapper.bind(this),
      only: this.options.only,
      directory: this.options.directory
    }));
  }
};

Check.prototype.checkFiles = function () {
  for (var i = 0; i < this.processors.length; i++) {
    this.processors[i].checkFiles();
  }
};

Check.prototype.checkWrapper = function (file, checker) {
  try {
    checker(file);
    this.print(green("."));
  } catch (e) {
    this.errors.push(e.message + "\n" + file);
    this.print(red("F"));
  }
};

Check.prototype.isSuccess = function () {
  return !this.errors.length;
};

Check.prototype.printSummary = function () {
  var processors = this.processors;
  var summary;
  var errors = this.errors;
  var errorsLen = errors.length;
  var i;
  var translationCount = sum(processors, 'translationCount');
  var fileCount = sum(processors, 'fileCount');
  var elapsed = new Date().getTime() - this.startTime;
  this.print("\n\n");

  for (i = 0; i < errorsLen; i++) {
    this.print(i + 1 + ")\n" + red(errors[i]) + "\n\n");
  }

  this.print("Finished in " + elapsed / 1000 + " seconds\n\n");
  summary = fileCount + " files, " + translationCount + " strings, " + errorsLen + " failures";
  this.print((this.isSuccess() ? green : red)(summary) + "\n");
};

Check.prototype.run = function () {
  this.startTime = new Date().getTime();
  this.checkFiles();
  this.printSummary();
  return this.isSuccess();
};

Check.processors = {
  JsProcessor: _js_processor.default
};
var _default = Check;
exports.default = _default;
