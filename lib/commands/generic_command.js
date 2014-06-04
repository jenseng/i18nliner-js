/* global process */

function GenericCommand(options) {
  this.options = options;
  if (this.options.silent) {
    this.print = function(){};
  }
}

GenericCommand.prototype.print = function(string) {
  process.stdout.write(string);
};

export default GenericCommand;
