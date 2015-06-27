module.exports = function(grunt){
    grunt.loadNpmTasks('grunt-bower-requirejs');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-bower-install-simple');
    grunt.loadNpmTasks('grunt-npm-install');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-devserver');
    grunt.initConfig({
        bowerRequirejs: {
          target: {
            rjsConfig: 'config.js'
          }
        },
        karma: {
          unit: {
            configFile: 'karma.conf.js',
            singleRun: true
          }
        },
        'bower-install-simple': {
            options: {
                color: true,
                directory: 'bower_components'
            },
            'prod': {
                options: {
                    production: true
                }
            },
            'dev': {
                options: {
                    production: false
                }
            }
        },
        jshint: {
          // define the files to lint
          files: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
          // configure JSHint (documented at http://www.jshint.com/docs/)
          options: {
              // more options here if you want to override JSHint defaults
            globals: {
              jQuery: true,
              console: true,
              module: true,
              document: true
            }
          }
        },
        watch: {
          files: ['<%= jshint.files %>', 'bower.json', 'index.html'],
          tasks: ['build', 'lint'],
          options: {
            atBegin: true,
            livereload: true,
          },
        },
        devserver: {
            options: {
                'async': false,
            },
            server: {},
        },
    });
    grunt.registerTask('build', ['bowerRequirejs']);
    grunt.registerTask('lint', ['jshint']);
    grunt.registerTask('default', ['devserver', 'watch']);
    grunt.registerTask('auto', ['build', 'watch']);
    grunt.registerTask('setup', ['bower-install-simple', 'npm-install', 'default']);
    grunt.registerTask('test', ['build', 'lint', 'karma']);
};
