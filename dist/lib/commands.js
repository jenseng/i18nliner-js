"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _check = _interopRequireDefault(require("./commands/check"));

var _export = _interopRequireDefault(require("./commands/export"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* global process */
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
  Check: _check.default,
  Export: _export.default
};
var _default = Commands;
exports.default = _default;
