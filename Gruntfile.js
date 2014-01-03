var matchdep = require('matchdep');

module.exports = function(grunt){
  matchdep.filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.initConfig({

    clean: {
      tmp: [ 'tmp/**/*' ]
    },

    transpile: {
      testLib: {
        expand: true,
        type: 'cjs',
        cwd: 'lib',
        src: [ '**/*.js' ],
        dest: 'tmp/lib',
        compatFix: true
      },
      tests: {
        expand: true,
        type: 'cjs',
        cwd: 'test',
        src: [ '**/*.js' ],
        dest: 'tmp/test',
        compatFix: true
      }
    }
  });

  grunt.registerTask('test', [ 'clean', 'transpile:testLib', 'transpile:tests' ]);
  grunt.registerTask('default', [ 'transpile:testLib', 'transpile:tests' ]);
};
