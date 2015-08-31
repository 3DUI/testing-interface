module.exports = function(grunt){
    grunt.loadNpmTasks('grunt-bower-requirejs');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-devserver');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-babel');

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
          files: ['Gruntfile.js', 'dist/**/*.js', 'test/**/*.js'],
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
          files: ['Gruntfile.js', 'src/**/*.js*', 'test/**/*.js', 'bower.json', 'index.html', '**/*.json', '**/*.md'],
          tasks: ['build'],
          options: {
            atBegin: true,
            livereload: true,
            livereloadOnErro: false,
          },
        },
        devserver: {
            options: {
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
        babel: {
            options: {
                sourceMap: true
            },
            dist: {
                files:[
                    {
                        expand: true,
                        cwd: 'src/',
                        src: ['*.js*'],
                        dest: 'dist/',
                    }
                ]
            }
        },
    });
    grunt.registerTask('build', ['bowerRequirejs', 'babel']);
    grunt.registerTask('lint', ['jshint']);
    grunt.registerTask('default', ['watch']);
    grunt.registerTask('auto', ['build', 'watch']);
    grunt.registerTask('test', ['build', 'lint', 'karma']);
    grunt.registerTask('serve', ['shell']);
};
