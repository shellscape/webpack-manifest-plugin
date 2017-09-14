var fse = require('fs-extra');
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

  compiler.watch({
    aggregateTimeout: 300,
    poll: true
  }, function(err, stats){
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
        var manifest = JSON.parse(fse.readFileSync(path.join(__dirname, 'output/single-file/manifest.json')))

        expect(manifest).toBeDefined();
        expect(manifest).toEqual({
          'main.js': 'main.js'
        });

        done();
      });
    });
  });

  describe('watch mode', function() {
    var hashes;

    beforeAll(function () {
      fse.outputFileSync(path.join(__dirname, 'output/watch-mode/index.js'), 'console.log(\'v1\')');
      hashes = [];
    });

    it('outputs a manifest of one file', function(done) {
      webpackCompile({
        context: __dirname,
        output: {
          filename: '[name].[hash].js',
          path: path.join(__dirname, 'output/watch-mode')
        },
        entry: './output/watch-mode/index.js',
        watch: true,
        plugins: [
          new ManifestPlugin(),
          new webpack.HotModuleReplacementPlugin()
        ]
      }, {}, function(stats) {
        var manifest = JSON.parse(fse.readFileSync(path.join(__dirname, 'output/watch-mode/manifest.json')))

        expect(manifest).toBeDefined();
        expect(manifest).toEqual({
          'main.js': 'main.'+ stats.hash +'.js'
        });

        hashes.push(stats.hash);

        if (hashes.length === 2) {
          // TODO: uncomment when dropping support for node@10
          // expect(hashes[0]).not.toEqual(hashes[1]);
          return done();
        }

        fse.outputFileSync(path.join(__dirname, 'output/watch-mode/index.js'), 'console.log(\'v2\')');
      });
    });
  });

  describe('set location of manifest', function() {
    describe('using relative path', function() {
      beforeEach(function() {
        rimraf.sync(path.join(__dirname, 'output/relative-manifest'));
      });

      it('should use output to the correct location', function(done) {
        webpackCompile({
          context: __dirname,
          entry: './fixtures/file.js',
          output: {
            path: path.join(__dirname, 'output/relative-manifest'),
            filename: '[name].js'
          },
          plugins: [
            new ManifestPlugin({
              fileName: 'webpack.manifest.js',
            })
          ]
        }, {}, function(manifest, stats, fs) {
          var manifestPath = path.join(__dirname, 'output/relative-manifest', 'webpack.manifest.js');

          var manifest = JSON.parse(fse.readFileSync(manifestPath).toString());

          expect(manifest).toEqual({
            'main.js': 'main.js'
          });

          done();
        });
      });
    });

    describe('using absolute path', function() {
      beforeEach(function() {
        rimraf.sync(path.join(__dirname, 'output/absolute-manifest'));
      });

      it('should use output to the correct location', function(done) {
        webpackCompile({
          context: __dirname,
          entry: './fixtures/file.js',
          output: {
            path: path.join(__dirname, 'output/absolute-manifest'),
            filename: '[name].js'
          },
          plugins: [
            new ManifestPlugin({
              fileName: path.join(__dirname, 'output/absolute-manifest', 'webpack.manifest.js')
            })
          ]
        }, {}, function(manifest, stats, fs) {
          var manifestPath = path.join(__dirname, 'output/absolute-manifest', 'webpack.manifest.js');

          var manifest = JSON.parse(fse.readFileSync(manifestPath).toString());

          expect(manifest).toEqual({
            'main.js': 'main.js'
          });

          done();
        });
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
        var manifest = JSON.parse(fse.readFileSync(path.join(__dirname, 'output/emit/manifest.json')))

        expect(manifest).toBeDefined();
        expect(manifest).toEqual({
          'main.js': 'main.js'
        });

        done();
      });
    });
  });
});
