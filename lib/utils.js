var Utils = {
  difference: function(a1, a2) {
    var result = [];
    for (var i = 0, len = a1.length; i < len; i++) {
      if (a2.indexOf(a1[i]) === -1)
        result.push(a1[i]);
    }
    return result;
  },

  keys: function(object) {
    var keys = [];
    for (var key in object) {
      if (object.hasOwnProperty(key))
        keys.push(key);
    }
    return keys;
  }
}
export default Utils;
