/* global process */

import Globby from "gglobby";
import I18nliner from "../i18nliner";

function chdir(dir, cb) {
  var origDir = process.cwd();
  try {
    process.chdir(dir);
    return cb();
  }
  finally {
    process.chdir(origDir);
  }
}

function AbstractProcessor(translations, options) {
  this.translations = translations;
  this.translationCount = 0;
  this.fileCount = 0;
  this.checkWrapper = options.checkWrapper || this.checkWrapper;
  this.pattern = options.pattern || this.defaultPattern;
  this.file = options.file;
  if (options.directory)
    this.directories = [options.directory];
  this.only = options.only;
}

AbstractProcessor.prototype.checkWrapper = function(file, checker) {
  checker(file);
};

AbstractProcessor.prototype.files = function(directory) {
  var pattern = this.pattern instanceof Array ? this.pattern : [this.pattern];
  return chdir(directory, function() {
    var fileScope = Globby.
      select(pattern).
      reject(["/node_modules", "/bower_components"]).
      reject(I18nliner.ignore());
    if (this.only) {
      var only = this.only instanceof Array ? this.only : [this.only];
      fileScope = fileScope.select(only);
    }
    return fileScope.files;
  }.bind(this));
};

AbstractProcessor.prototype.checkFiles = function() {
  var directories = this.getDirectories();
  var directoriesLen = directories.length;
  var i;
  for (i = 0; i < directoriesLen; i++) {
    this.checkFilesIn(directories[i]);
  }
};

AbstractProcessor.prototype.checkFilesIn = function(directory) {
  var files = this.files(directory);
  var filesLen = files.length;
  var checkWrapper = this.checkWrapper;
  var checkFile = this.checkFile.bind(this);
  var i;
  for (i = 0; i < filesLen; i++) {
    checkWrapper(directory + "/" + files[i], checkFile);
  }
};

AbstractProcessor.prototype.checkFile = function(file) {
  this.fileCount++;
  return this.checkContents(this.sourceFor(file), file);
};

AbstractProcessor.prototype.getDirectories = function() {
  if (this.directories) return this.directories;
  if (I18nliner.config.directories.length) return I18nliner.config.directories;
  return [I18nliner.config.basePath];
};

export default AbstractProcessor;
