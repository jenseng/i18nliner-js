"use strict";
/* global process */

var Check = require("./commands/check")["default"] || require("./commands/check");
var Export = require("./commands/export")["default"] || require("./commands/export");

var error = process.stdout.write;

function capitalize(string) {
  return typeof(string) === "string" && string ?
    string.slice(0, 1).toUpperCase() + string.slice(1) :
    string;
}

var Commands = {
  run: function(name, options) {
    options = options || {};
    var Command = this[capitalize(name)];
    if (Command) {
      try {
        return (new Command(options)).run();
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

exports["default"] = Commands;