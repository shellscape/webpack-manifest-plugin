var path = require('path');
var fs = require('fs');

var webpack = require('webpack');
var rimraf = require('rimraf');
var _ = require('lodash');

var plugin = require('../index.js');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var OUTPUT_DIR = path.join(__dirname, './webpack-out');
var manifestPath = path.join(OUTPUT_DIR, 'manifest.json');

function webpackCompile(opts, cb) {

  var config = _.merge({
    output: {
      path: OUTPUT_DIR,
      filename: '[name].js'
    },
    plugins: [
      new plugin(opts.manifestOptions)
    ]
  }, opts);

  webpack(config, function(err, stats){
    var manifestFile = JSON.parse( fs.readFileSync(manifestPath).toString() );

    expect(err).toBeFalsy();
    expect(stats.hasErrors()).toBe(false);

    cb(manifestFile, stats);
  });
};

describe('ManifestPlugin', function() {

  beforeEach(function(done) {
    rimraf(OUTPUT_DIR, done);
  });

  it('exists', function() {
    expect(plugin).toBeDefined();
  });

  describe('basic behavior', function(){
    it('outputs a manifest of one file', function(done) {
      webpackCompile({
        entry: path.join(__dirname, './fixtures/file.js')
      }, function(manifest){
        expect(manifest).toBeDefined();
        expect(manifest['main.js']).toBeDefined();
        expect(manifest['main.js']).toEqual('main.js');
        done();
      });

    });

    it('outputs a manifest of multiple files', function(done) {
      webpackCompile({
        entry: {
          one: path.join(__dirname, './fixtures/file.js'),
          two: path.join(__dirname, './fixtures/file-two.js')
        }
      }, function(manifest){
        expect(manifest['one.js']).toEqual('one.js');
        expect(manifest['two.js']).toEqual('two.js');
        done();
      });
    });

    it('works with hashes in the filename', function(done) {
      webpackCompile({
        entry: {
          one: path.join(__dirname, './fixtures/file.js'),
        },
        output: {
          filename: '[name].[hash].js'
        }
      }, function(manifest, stats){
        expect(manifest['one.js']).toEqual('one.' + stats.hash + '.js');
        done();
      });
    });

    it('prefixes definitions with a base path', function(done) {
      webpackCompile({
        manifestOptions: {basePath: '/app/'},
        entry: {
          one: path.join(__dirname, './fixtures/file.js'),
        },
        output: {
          filename: '[name].[hash].js'
        }
      }, function(manifest, stats){
        expect(manifest['/app/one.js']).toEqual('/app/one.' + stats.hash + '.js');
        done();
      });
    });
  });

  describe('with ExtractTextPlugin', function(){
    it('works when extracting css into a seperate file', function(done){
      webpackCompile({
        entry: {
          wStyles: [
            path.join(__dirname, './fixtures/file.js'),
            path.join(__dirname, './fixtures/style.css')
          ]
        },
        output: {
          filename: '[name].js'
        },
        module: {
          loaders: [{
            test: /\.css$/,
            loader: ExtractTextPlugin.extract('style', 'css')
          }]
        },
        plugins: [
          new plugin(),
          new ExtractTextPlugin('[name].css', {
            allChunks: true
          })
        ]
      }, function(manifest, stats){
        expect(manifest['wStyles.js']).toEqual('wStyles.js');
        expect(manifest['wStyles.css']).toEqual('wStyles.css');
        done();
      });

    });
  });
});
