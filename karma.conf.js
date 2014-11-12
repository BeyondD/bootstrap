(function() {
  "use strict";

  module.exports = function(config) {
    config.set({
      // base path, that will be used to resolve files and exclude
      basePath: '.',

      // list of files / patterns to load in the browser
      files: [
        'misc/test-lib/jquery-1.8.2.min.js',
        'misc/test-lib/angular.js',
        'misc/test-lib/angular-mocks.js',
        'misc/test-lib/helpers.js',
        'src/**/*.js',
        'template/**/*.js'
      ],

      // list of files to exclude
      exclude: [
        'src/**/docs/*'
      ],

      // Start these browsers, currently available:
      // - Chrome
      // - ChromeCanary
      // - IE
      // - IE8
      // - IE9
      // - Firefox
      // - Opera
      // - Safari
      // - PhantomJS
      browsers: [
        'PhantomJS'/*,
        'IE8'*/
      ],

      customLaunchers: {
        IE9: {
          base: 'IE',
          'x-ua-compatible': 'IE=EmulateIE9'
        },
        IE8: {
          base: 'IE',
          'x-ua-compatible': 'IE=EmulateIE8'
        }
      },

      // test results reporter to use
      // possible values: dots || progress
      reporters: ['progress'],

      frameworks: ['jasmine'],

      preprocessors: {
        'src/**/*.js': ['coverage']
      },

      reportSlowerThan: 100,

      // web server port
      port: 9018,

      // cli runner port
      runnerPort: 9100,

      // enable / disable colors in the output (reporters and logs)
      colors: true,

      // level of logging
      // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
      logLevel: config.LOG_INFO,

      // enable / disable watching file and executing tests whenever any file changes
      autoWatch: false,

      // Continuous Integration mode
      // if true, it capture browsers, run tests and exit
      singleRun: false
    });
  };
})();