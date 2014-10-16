import fs from "fs";

var I18nliner = {
  ignore: function() {
    var ignores = [];
    if (fs.existsSync(".i18nignore")) {
      ignores = fs.readFileSync(".i18nignore").toString().trim().split(/\r?\n|\r/);
    }
    return ignores;
  },
  set: function(key, value, fn) {
    var prevValue = this[key];
    this[key] = value;
    if (fn) {
      try {
        fn();
      }
      finally {
        this[key] = prevValue;
      }
    }
  },
  inferredKeyFormat: 'underscored_crc32',
  underscoredKeyLength: 50,
  basePath: "."
};
export default I18nliner;
