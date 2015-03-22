var path = require('path');
var fs = require('fs');

var webpack = require('webpack');
var rimraf = require('rimraf');
var _ = require('lodash');

var plugin = require('../index.js');

var OUTPUT_DIR = path.join(__dirname, './webpack-out');
var manifestPath = path.join(OUTPUT_DIR, 'manifest.json');

function webpackCompile(opts, cb) {
  var config = _.merge({
    output: {
      path: OUTPUT_DIR,
      filename: '[name].js'
    },
    plugins: [
      new plugin()
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
        two: path.join(__dirname, './fixtures/file.js')
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
});
