'use strict';

/**
 * Config responsible for building Handsontable `dist/` minified files:
 *  - handsontable.min.js
 *  - handsontable.min.css
 *  - handsontable.full.min.js
 *  - handsontable.full.min.css
 */
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var configFactory = require('./development');

var env = process.env.NODE_ENV;
var PACKAGE_NAME = configFactory.PACKAGE_NAME;

module.exports.PACKAGE_NAME = PACKAGE_NAME;

module.exports.create = function create(envArgs) {
  var config = configFactory.create(envArgs);

  // Add uglifyJs plugin for each configuration
  config.forEach(function(c) {
    var isFullBuild = /\.full\.js$/.test(c.output.filename);

    c.devtool = false;
    c.output.filename = c.output.filename.replace(/\.js$/, '.min.js');

    // Remove all 'ExtractTextPlugin' instances
    c.plugins = c.plugins.filter(function(plugin) {
      return !(plugin instanceof ExtractTextPlugin);
    });

    c.plugins.push(
      new webpack.optimize.UglifyJsPlugin({
        compressor: {
          pure_getters: true,
          warnings: false,
          screw_ie8: true,
        },
        mangle: {
          screw_ie8: true,
        },
        output: {
          comments: /^!|@preserve|@license|@cc_on/i,
          screw_ie8: true,
        },
      }),
      new ExtractTextPlugin(PACKAGE_NAME + (isFullBuild ? '.full' : '') + '.min.css'),
      new OptimizeCssAssetsPlugin({
        assetNameRegExp: isFullBuild ? /\.full\.min\.css$/ : /\.min\.css$/,
      })
    );

    if (isFullBuild) {
      c.plugins.push(
        new CopyWebpackPlugin([
          { // hot-formula-parser
            from: {glob: 'node_modules/hot-formula-parser/LICENSE'}, to: 'hot-formula-parser', flatten: true
          },
          {
            from: {glob: 'node_modules/hot-formula-parser/dist/formula-parser.js'}, to: 'hot-formula-parser', flatten: true
          },
          { // moment
            from: {glob: 'node_modules/moment/@(moment.js|LICENSE)'}, to: 'moment', flatten: true
          },
          {
            from: {glob: 'node_modules/moment/locale/*.js'}, to: 'moment/locale', flatten: true
          },
          { // numbro
            from: {glob: 'node_modules/numbro/@(LICENSE-Numeraljs|LICENSE)'}, to: 'numbro', flatten: true
          },
          {
            from: {glob: 'node_modules/numbro/dist/@(numbro.js|languages.js)'}, to: 'numbro', flatten: true
          },
          {
            from: {glob: 'node_modules/numbro/dist/languages/*.js'}, to: 'numbro/languages', flatten: true
          },
          { // pikaday
            from: {glob: 'node_modules/pikaday/@(LICENSE|pikaday.js)'}, to: 'pikaday', flatten: true
          },
          {
            from: {glob: 'node_modules/pikaday/css/pikaday.css'}, to: 'pikaday', flatten: true
          },
          { // zeroclipboard
            from: {glob: 'node_modules/zeroclipboard/dist/ZeroClipboard.@(js|swf)'}, to: 'zeroclipboard', flatten: true
          },
          {
            from: {glob: 'node_modules/zeroclipboard/LICENSE'}, to: 'zeroclipboard', flatten: true
          },
        ])
      );
    }
  });

  return config;
}
