"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

/* global process */

var Check = _interopRequire(require("./commands/check"));

var Export = _interopRequire(require("./commands/export"));

var error = process.stderr.write.bind(process.stderr);

function capitalize(string) {
  return typeof string === "string" && string ? string.slice(0, 1).toUpperCase() + string.slice(1) : string;
}

var Commands = {
  run: function run(name, options) {
    options = options || {};
    var Command = this[capitalize(name)];
    if (Command) {
      try {
        return new Command(options).run();
      } catch (e) {
        error(e.message + "\n");
      }
    } else {
      error("unknown command " + name + "\n");
    }
    return false;
  },

  Check: Check,
  Export: Export
};

module.exports = Commands;