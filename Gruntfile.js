// We use Grunt to build our dist files
// commands are run by the makefile
var Promise = require('es6-promise').Promise;

global.window = {
  document: {},
  Function: function(){}
};

module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    sass: {
      lib: {
        options: {
          sourceMap: false,
          includePaths: ['_lib']
        },
        files: [
          {
            expand: true,
            cwd: "_lib/",
            src: ['solid.scss'],
            dest: 'dist',
            ext: '.<%= pkg.version %>.css'
          }
        ]
      }
    },
    cssnano: {
      options: {
        sourcemap: false
      },
      lib: {
        files: {
         'dist/solid.<%= pkg.version %>.min.css' : 'dist/solid.<%= pkg.version %>.css'
        }
      }
    },
    compress: {
      lib: {
         options: {
             archive: 'dist/solid.<%= pkg.version %>.zip',
             mode: 'zip'
         },
         files: [{
             src: ['**/*'],
             cwd: '_lib/',
             expand: true
         }]
      }
    },
    copy: {
      latest: {
        files: [{
          expand: true,
          cwd: 'dist/',
          src: 'solid.<%= pkg.version %>.css',
          dest: 'dist/',
          rename: function(dest, src) {
            src = "solid.latest.css" //always available latest css
            return dest + src;
          }
        }]
      }
    },
    clean: [
      'dist/',
      '.tmp/'
    ],
    connect: {
      dev_server: {
        options: {
          port: 8888,
          livereload: true,
          base: '.',
          directory: 'example',
        },
      },
    },
    watch: {
      css: {
        files: '_lib/**/*.scss',
        tasks: ['dev_solid'],
        options: {
          livereload: true,
        },
      },
      example: {
        files: 'example/**/*',
        options: {
          livereload: true,
        },
      },
    },
  });

  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-cssnano');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('prepare_solid_dist', ['sass:lib', 'cssnano:lib', 'copy:latest', 'compress:lib']);
  grunt.registerTask('dist', ['clean', 'prepare_solid_dist']);
  grunt.registerTask('dev_solid', ['sass:lib', 'copy:latest']);
  grunt.registerTask('dev', ['connect:dev_server', 'watch']);
}
