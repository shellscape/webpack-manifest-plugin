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

    cb(manifestFile);
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
      expect(manifest.main).toBeDefined();
      expect(manifest.main).toEqual('main.js');
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
      expect(manifest.one).toEqual('one.js');
      expect(manifest.two).toEqual('two.js');
      done();
    });

  });

});
