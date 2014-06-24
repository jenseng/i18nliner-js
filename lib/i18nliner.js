var I18nliner = {
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
