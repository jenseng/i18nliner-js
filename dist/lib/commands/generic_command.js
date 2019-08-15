"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/* global process */
function GenericCommand(options) {
  this.options = options;

  if (this.options.silent) {
    this.print = function () {};
  }
}

GenericCommand.prototype.print = function (string) {
  process.stdout.write(string);
};

var _default = GenericCommand;
exports.default = _default;
