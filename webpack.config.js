const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BowerWebpackPlugin = require('bower-webpack-plugin');
const PATHS = {
  app: path.join(__dirname, 'app'),
  build: path.join(__dirname, 'www'),
};

const PRIVATE_MODULES = [
  path.resolve(__dirname, 'app')
];

module.exports = {
  historyApiFallback: true,
  entry: {
    app: [
      PATHS.app
    ],
    vendor: ['angular', 'ionic/release/js/ionic.js', 'ionic/release/js/ionic-angular.js', 'angular-sanitize', 'angular-animate', 'angular-ui-router', 'angular-aria', 'ngstorage', 'angular-messages', 'angular-translate', 'angular-translate-loader-partial']
  },
  output: {
    path: PATHS.build,
    filename: '[name].js',
    chunkFilename: '[chunkhash].js',
    hash: true
  },
  resolve: {
    root: [
      path.join(__dirname, 'app'),
      path.join(__dirname, 'bower_components'),
      path.join(__dirname, 'node_modules')
    ],
    moduleDirectories: [
      path.resolve('./bower_components'),
      path.resolve('./node_modules')
    ],
    alias: {
      app: [path.join(__dirname, 'app')]
    }
  },
  module: {
    preLoaders: [{
      test: /\.js$/,
      loaders: ['eslint'],
      include: /app/
    }],
    loaders: [{
      test: /\.css$/,
      loader: 'style!css'
    }, {
      test: /\.scss$/,
      loader: 'style!css!sass?outputStyle=expanded'
    }, {
      test: /\.js$/,
      loaders: ['ng-annotate', 'babel?cacheDirectory&presets[]=react,presets[]=es2015,presets[]=stage-1'],
      include: PRIVATE_MODULES
    }, {
      test: /\.html$/,
      loader: 'ngtemplate?relativeTo=components/',
      exclude: /Lazy/,
      include: /components/
    }, {
      test: /\.html$/,
      loader: 'html',
      include: /components/
    }, {
      test: /\.woff/,
      loader: 'url?limit=10000&mimetype=application/font-woff&name=fonts/[name].[ext]'
    }, {
      test: /\.ttf/,
      loader: 'file?name=fonts/[name].[ext]'
    }, {
      test: /\.eot/,
      loader: 'file?name=fonts/[name].[ext]'
    }, {
      test: /fonts[\/\\].*\.svg/,
      loader: 'file?name=fonts/[name].[ext]'
    }, {
      test: /\.(jpe?g|png|gif|svg)$/i,
      loaders: [
        'file?hash=sha512&digest=hex&name=images/[hash].[ext]',
        'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false'
      ]
    }, {
      test: /\.json/,
      loader: 'file?name=locale/[path][name].[ext]',
      include: /locale/
    }, {
      test: /[\/\\]angular\.js$/,
      loader: 'exports?angular'
    }, {
      test: /[\/\\]ionic\.js$/,
      loader: 'exports?ionic'
    }]
  },
  plugins: [
    new webpack.ProvidePlugin({
      // _: 'lodash'
    }),
    new webpack.ResolverPlugin(
      new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin(
        'package.json', ['main']
      )
    ),
    new BowerWebpackPlugin({
      searchResolveModulesDirectories: false
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: Infinity
    }),
    new HtmlWebpackPlugin({
      title: 'todo',
      template: './app/index.html',
      inject: 'body'
    }),
    new webpack.NoErrorsPlugin()
  ]
};
