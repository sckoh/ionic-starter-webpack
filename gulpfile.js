var gulp = require('gulp');
var gutil = require('gulp-util');
var del = require('del');
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var webpackConfig = require('./webpack.config.js');
var argv = require('yargs').argv;
var open = require('gulp-open');
var connect = require('gulp-connect');

argv.env = argv.env || 'development';

// The development server (the recommended option for development)
gulp.task('default', ['webpack-dev-server', 'open-webpack-server-url']);

// Build and watch cycle (another option for development)
// Advantage: No server required, can run app from filesystem
// Disadvantage: Requests are not blocked until bundle is available,
//               can serve an old app on refresh
gulp.task('build-dev', ['webpack:build-dev'], function() {
  gulp.watch(['app/**/*'], ['webpack:build-dev']);
});

gulp.task('clean', function(done) {
  del(['www/**', '!www'])
    .then(function(paths) {
      done();
    });
});

gulp.task('webserver', function() {
  connect.server({
    root: 'www',
    port: '8081',
    livereload: true
  });
});

// Production build
gulp.task('build', ['clean', 'webpack:build']);

gulp.task('webpack:build', function(callback) {
  // modify some webpack config options
  var myConfig = Object.create(webpackConfig);
  myConfig.devtool = 'source-map';

  // if (argv.env != 'development') {
  console.log('argv.env: ' + argv.env);
  myConfig.plugins = myConfig.plugins.concat(
    new webpack.DefinePlugin({
      'process.env': {
        // This has effect on the react lib size
        'NODE_ENV': JSON.stringify(argv.env || 'development')
      }
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      minimize: true,
      sourceMap: false,
      comments: false,
      compress: {
        warnings: false,
        properties: true,
        sequences: true,
        dead_code: true,
        conditionals: true,
        comparisons: true,
        evaluate: true,
        booleans: true,
        unused: true,
        loops: true,
        hoist_funs: true,
        cascade: true,
        if_return: true,
        join_vars: true,
        drop_console: true,
        drop_debugger: true,
        unsafe: true,
        hoist_vars: true,
        negate_iife: true
      },
    })
  );
  // }

  // run webpack
  webpack(myConfig, function(err, stats) {
    if (err) throw new gutil.PluginError('webpack:build', err);
    gutil.log('[webpack:build]', stats.toString({
      colors: true
    }));

    callback();
  });
});

// modify some webpack config options
var myDevConfig = Object.create(webpackConfig);
myDevConfig.devtool = 'sourcemap';
myDevConfig.debug = true;

// create a single instance of the compiler to allow caching
var devCompiler = webpack(myDevConfig);

gulp.task('webpack:build-dev', function(callback) {
  // run webpack
  devCompiler.run(function(err, stats) {
    if (err) throw new gutil.PluginError('webpack:build-dev', err);
    gutil.log('[webpack:build-dev]', stats.toString({
      colors: true
    }));
    callback();
  });
});

gulp.task('open-webpack-server-url', function() {
  gulp.src(__filename)
    .pipe(open({
      uri: 'http://localhost:8080/index.html'
    }));
});

gulp.task('webpack-dev-server', function(callback) {
  // modify some webpack config options
  var myConfig = Object.create(webpackConfig);
  myConfig.devtool = 'eval';
  myConfig.debug = true;

  myConfig.plugins = myConfig.plugins.concat(
    new webpack.DefinePlugin({
      'process.env': {
        // This has effect on the react lib size
        'NODE_ENV': JSON.stringify(argv.env || 'development')
      }
    })
  );

  // Start a webpack-dev-server
  new WebpackDevServer(webpack(myConfig), {
    inline: true,
    historyApiFallback: true,
    stats: {
      colors: true
    }
  }).listen(8080, '0.0.0.0', function(err) {
    if (err) throw new gutil.PluginError('webpack-dev-server', err);
    gutil.log('[webpack-dev-server]', 'http://localhost:8080/webpack-dev-server');
  });
});
