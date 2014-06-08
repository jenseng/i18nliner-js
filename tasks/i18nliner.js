module.exports = function(grunt) {
  var Commands = require('../dist/lib/commands')['default'];
  grunt.registerTask('i18nliner', function(command) {
    Commands.run(command);
  });
};
