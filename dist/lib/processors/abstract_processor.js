"use strict";
/* global process */

var Globby = require("gglobby")["default"] || require("gglobby");
var I18nliner = require("../i18nliner")["default"] || require("../i18nliner");

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
}

AbstractProcessor.prototype.checkWrapper = function(file, checker) {
  checker(file);
};

AbstractProcessor.prototype.files = function(directory) {
  return chdir(directory, function() {
    return Globby.
      select([this.pattern]).
      reject(["/node_modules", "/bower_components"]).
      reject(I18nliner.ignore()).
      files;
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
  return this.checkContents(this.sourceFor(file));
};

AbstractProcessor.prototype.getDirectories = function() {
  if (this.directories) return this.directories;
  return [I18nliner.basePath];
};

exports["default"] = AbstractProcessor;