// Karma configuration
// Generated on Wed Oct 28 2015 23:29:05 GMT-0700 (PDT)

module.exports = function(config) {
  config.set({
    basePath: ''
  , frameworks: [ 'browserify', 'jasmine']
  , files: [ 'node_modules/jquery/dist/jquery.min.js', 'tests/**/*.js' ]
  , exclude: [ 'test/sources/test.js', 'test/sources/attest.js' ]

  , autoWatch: true
  , singleRun: false

  , preprocessors: { 'tests/**/*.js': ['browserify'] }
  , browserify: {
      debug: true
    , transform: [ [ 'babelify', { presets: ['es2015'] } ] ]
    }

    // possible values:
    // config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
  , logLevel: config.LOG_WARN
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
  , reporters: ['dots']
  , colors: true

  , browsers: ['PhantomJS']
  , port: 9876
  , concurrency: Infinity
  })
}
