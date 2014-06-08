/* global process */

import clc from "cli-color";

import TranslationHash from "../extractors/translation_hash";
import GenericCommand from "./generic_command";
import JsProcessor from "../processors/js_processor";
import I18nliner from "../i18nliner";

var red = clc.red;
var green = clc.green;

function sum(array, prop) {
  var total = 0;
  for (var i = 0, len = array.length; i < len; i++) {
    total += array[i][prop];
  }
  return total;
}

function chdir(dir, cb) {
  var origDir = process.cwd();
  try {
    process.chdir(dir);
    cb();
  }
  finally {
    process.chdir(origDir);
  }
}

function Check(options) {
  GenericCommand.call(this, options);
  this.errors = [];
  this.translations = new TranslationHash();
  this.setUpProcessors();
}

Check.prototype = Object.create(GenericCommand.prototype);
Check.prototype.constructor = Check;

Check.prototype.setUpProcessors = function() {
  this.processors = [];
  for (var i = 0; i < Check.config.processors.length; i++) {
    this.processors.push(
      new (Check.config.processors[i])(this.translations, {
        translations: this.translations,
        checkWrapper: this.checkWrapper.bind(this)
      })
    );
  }
};

Check.prototype.checkFiles = function() {
  chdir(I18nliner.basePath, function() {
    for (var i = 0; i < this.processors.length; i++) {
      this.processors[i].checkFiles();
    }
  }.bind(this));
};

Check.prototype.checkWrapper = function(file, checker) {
  try {
    checker(file);
    this.print(green("."));
  } catch (e) {
    this.errors.push(e.message + "\n" + file);
    this.print(red("F"));
  }
};

Check.prototype.isSuccess = function() {
  return !this.errors.length;
};

Check.prototype.printSummary = function() {
  var processors = this.processors;
  var summary;
  var errors = this.errors;
  var errorsLen = errors.length;
  var i;

  var translationCount = sum(processors, 'translationCount');
  var fileCount = sum(processors, 'fileCount');
  var elapsed = parseInt(((new Date()).getTime() - this.startTime) / 1000, 10);

  this.print("\n\n");

  for (i = 0; i < errorsLen; i++) {
    this.print((i + 1) + ")" + red(errors[i]) + "\n");
  }
  this.print("Finished in " + elapsed + " seconds\n\n");
  summary = fileCount + " files, " + translationCount + " strings, " + errorsLen + " failures";
  this.print((this.isSuccess() ? green : red)(summary) + "\n");
};

Check.prototype.run = function() {
  this.startTime = (new Date()).getTime();
  this.checkFiles();
  this.printSummary();
  return this.isSuccess();
};

Check.config = {
  processors: [JsProcessor]
};

export default Check;
