module.exports = function(grunt){
    grunt.loadNpmTasks('grunt-bower-requirejs');
    grunt.loadNpmTasks('grunt-karma');


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
        }
    });

    grunt.registerTask('default', ['bowerRequirejs']);
    grunt.registerTask('test', ['bowerRequirejs', 'karma']);
}
