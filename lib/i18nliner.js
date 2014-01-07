var I18nliner = {
  set: function(key, value, fn) {
    var prevValue = this[key];
    this[key] = value;
    if (fn) {
      fn();
      this[key] = prevValue;
    }
  },
  inferredKeyFormat: 'underscored_crc32'
};
export default I18nliner;
