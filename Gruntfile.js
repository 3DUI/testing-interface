module.exports = function(grunt){
    grunt.loadNpmTasks('grunt-bower-requirejs');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-devserver');
    grunt.loadNpmTasks('grunt-shell');

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
          files: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js', 'bower.json', 'index.html', '**/*.json'],
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
        shell: {
            options: {
                stderr: false
            },
            target: {
                command: 'bundle exec jekyll serve'
            }
       },
    });
    grunt.registerTask('build', ['bowerRequirejs']);
    grunt.registerTask('lint', ['jshint']);
    grunt.registerTask('default', ['build', 'devserver', 'watch']);
    grunt.registerTask('auto', ['build', 'watch']);
    grunt.registerTask('test', ['build', 'lint', 'karma']);
    grunt.registerTask('serve', ['shell']);
};
