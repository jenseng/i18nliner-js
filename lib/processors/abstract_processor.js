import glob from "glob";

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

AbstractProcessor.prototype.files = function() {
  // TODO: .i18nignore
  var files = glob.sync(this.pattern);
  var filesLen = files.length;
  var file;
  var i;
  var result = [];
  for (i = 0; i < filesLen; i++) {
    file = files[i];
    if (!file.match(/^(node_modules|bower_components)/))
      result.push(file);
  }
  return result;
};

AbstractProcessor.prototype.checkFiles = function() {
  var files = this.files();
  var filesLen = files.length;
  var checkWrapper = this.checkWrapper;
  var checkFile = this.checkFile.bind(this);
  var i;
  for (i = 0; i < filesLen; i++) {
    checkWrapper(files[i], checkFile);
  }
};

AbstractProcessor.prototype.checkFile = function(file) {
  this.fileCount++;
  return this.checkContents(this.sourceFor(file));
};

export default AbstractProcessor;
