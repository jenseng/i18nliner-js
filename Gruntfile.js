/* global require, module */
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
    },

    jshint: {
      all: ['Gruntfile.js', 'lib/**/*.js', 'test/**/*.js'],
      options: {
        esnext: true,
        camelcase: true,
        eqeqeq: true,
        forin: true,
        immed: true,
        indent: 2,
        undef: true,
        latedef: true,
        newcap: true,
        nonew: true,
        unused: true,
        trailing: true
      }
    },

    browserify: {
      dist: {
        files: {
          'build/i18n_js_extension.js': ['tmp/lib/extensions/i18n_js_build.js']
        }
      }
    },

    copy: {
      main: {
        cwd: 'tmp/lib/',
        src: '**',
        dest: 'dist/lib/',
        expand: true
      }
    }
  });

  grunt.registerTask('test', [ 'clean', 'transpile:testLib', 'transpile:tests' ]);
  grunt.registerTask('default', [ 'transpile:testLib', 'transpile:tests' ]);
  grunt.registerTask('dist', ['test', 'copy']);
};
