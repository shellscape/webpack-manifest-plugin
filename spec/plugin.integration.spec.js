var fs = require('fs');
var path = require('path');

var _ = require('lodash');
var webpack = require('webpack');
var MemoryFileSystem = require('memory-fs');
var rimraf = require('rimraf');

var ManifestPlugin = require('../index.js');

function webpackConfig(webpackOpts, opts) {
  return _.merge({
    plugins: [
      new ManifestPlugin(opts.manifestOptions)
    ]
  }, webpackOpts);
}

function webpackCompile(config, compilerOps, cb) {
  var compiler = webpack(config);

  _.assign(compiler, compilerOps);

  compiler.run(function(err, stats){
    expect(err).toBeFalsy();
    expect(stats.hasErrors()).toBe(false);

    cb(stats);
  });
};

describe('ManifestPlugin using real fs', function() {
  beforeEach(function() {
    rimraf.sync(path.join(__dirname, 'output/single-file'));
  });

  describe('basic behavior', function() {
    it('outputs a manifest of one file', function(done) {
      webpackCompile({
        context: __dirname,
        output: {
          filename: '[name].js',
          path: path.join(__dirname, 'output/single-file')
        },
        entry: './fixtures/file.js',
        plugins: [
          new ManifestPlugin()
        ]
      }, {}, function() {
        var manifest = JSON.parse(fs.readFileSync(path.join(__dirname, 'output/single-file/manifest.json')))

        expect(manifest).toBeDefined();
        expect(manifest).toEqual({
          'main.js': 'main.js'
        });

        done();
      });
    });
  });
});

describe('ManifestPlugin with memory-fs', function() {
  describe('writeToFileEmit', function() {
    beforeEach(function() {
      rimraf.sync(path.join(__dirname, 'output/emit'));
    });

    it('outputs a manifest of one file', function(done) {
      webpackCompile({
        context: __dirname,
        output: {
          filename: '[name].js',
          path: path.join(__dirname, 'output/emit')
        },
        entry: './fixtures/file.js',
        plugins: [
          new ManifestPlugin({
            writeToFileEmit: true
          })
        ]
      }, {
        outputFileSystem: new MemoryFileSystem()
      }, function() {
        var manifest = JSON.parse(fs.readFileSync(path.join(__dirname, 'output/emit/manifest.json')))

        expect(manifest).toBeDefined();
        expect(manifest).toEqual({
          'main.js': 'main.js'
        });

        done();
      });
    });
  });
});
