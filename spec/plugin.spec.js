var path = require('path');

var MemoryFileSystem = require('memory-fs');
var webpack = require('webpack');
var _ = require('lodash');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var extractTextPluginMajorVersion = require('extract-text-webpack-plugin/package.json').version.split('.')[0];
var plugin = require('../index.js');
// add plugin to get third party assets included
var FakeCopyWebpackPlugin = require('./helpers/copy-plugin-mock');

// TODO: remove when dropping support for webpack@1
if (Number(extractTextPluginMajorVersion) > 1) {
  function FakeExtractTextPlugin(fileName, opts) {
    ExtractTextPlugin.call(this, _.assign(
      opts,
      {
        filename: fileName
      }
    ));
  }

  FakeExtractTextPlugin.prototype = Object.create(ExtractTextPlugin.prototype);
  FakeExtractTextPlugin.prototype.constructor = FakeExtractTextPlugin;

  FakeExtractTextPlugin.extract = function (fallback, use) {
    return ExtractTextPlugin.extract({
      fallback: fallback,
      use: use
    });
  };
} else {
  FakeExtractTextPlugin = ExtractTextPlugin;
}

var OUTPUT_DIR = path.join(__dirname, './webpack-out');
var manifestPath = path.join(OUTPUT_DIR, 'manifest.json');

function webpackConfig(webpackOpts, opts) {
  return _.merge({
    output: {
      path: OUTPUT_DIR,
      filename: '[name].js'
    },
    plugins: [
      new plugin(opts.manifestOptions)
    ]
  }, webpackOpts);
}

function webpackCompile(webpackOpts, opts, cb) {
  var config;
  if (Array.isArray(webpackOpts)) {
    config = webpackOpts.map(function (x) {
      return webpackConfig(x, opts);
    });
  }
  else {
    config = webpackConfig(webpackOpts, opts);
  }

  var compiler = webpack(config);

  var fs = compiler.outputFileSystem = new MemoryFileSystem();

  compiler.run(function (err, stats) {
    var manifestFile = JSON.parse(fs.readFileSync(manifestPath).toString());

    expect(err).toBeFalsy();
    expect(stats.hasErrors()).toBe(false);

    cb(manifestFile, stats);
  });
};

describe('ManifestPlugin', function () {

  it('exists', function () {
    expect(plugin).toBeDefined();
  });

  describe('basic behavior', function () {
    it('outputs a manifest of one file', function (done) {
      webpackCompile({
        context: __dirname,
        entry: './fixtures/file.js'
      }, {}, function (manifest) {
        expect(manifest).toBeDefined();
        expect(manifest).toEqual({
          'main.js': 'main.js'
        });

        done();
      });
    });

    it('outputs a manifest of multiple files', function (done) {
      webpackCompile({
        context: __dirname,
        entry: {
          one: './fixtures/file.js',
          two: './fixtures/file-two.js'
        }
      }, {}, function (manifest) {
        expect(manifest).toEqual({
          'one.js': 'one.js',
          'two.js': 'two.js'
        });

        done();
      });
    });

    it('works with hashes in the filename', function (done) {
      webpackCompile({
        context: __dirname,
        entry: {
          one: './fixtures/file.js',
        },
        output: {
          filename: '[name].[hash].js'
        }
      }, {}, function(manifest, stats) {
        expect(manifest).toEqual({
          'one.js': 'one.' + stats.hash + '.js'
        });

        done();
      });
    });

    it('works with source maps', function (done) {
      webpackCompile({
        context: __dirname,
        devtool: 'sourcemap',
        entry: {
          one: './fixtures/file.js',
        },
        output: {
          filename: '[name].js'
        }
      }, {}, function (manifest, stats) {
        expect(manifest).toEqual({
          'one.js': 'one.js',
          'one.js.map': 'one.js.map'
        });

        done();
      });
    });

    it('prefixes definitions with a base path', function (done) {
      webpackCompile({
        context: __dirname,
        entry: {
          one: './fixtures/file.js',
        },
        output: {
          filename: '[name].[hash].js'
        }
      }, {
        manifestOptions: {
          basePath: '/app/'
        }
      }, function (manifest, stats) {
        expect(manifest).toEqual({
          '/app/one.js': '/app/one.' + stats.hash + '.js'
        });

        done();
      });
    });

    it('prefixes paths with a public path', function (done) {
      webpackCompile({
        context: __dirname,
        entry: {
          one: './fixtures/file.js',
        },
        output: {
          filename: '[name].[hash].js'
        }
      }, {
        manifestOptions: {
          publicPath: '/app/'
        }
      }, function (manifest, stats) {
        expect(manifest).toEqual({
          'one.js': '/app/one.' + stats.hash + '.js'
        });

        done();
      });
    });

    it('prefixes definitions with a base path when public path is also provided', function (done) {
      webpackCompile({
        context: __dirname,
        entry: {
          one: './fixtures/file.js',
        },
        output: {
          filename: '[name].[hash].js'
        }
      }, {
        manifestOptions: {
          basePath: '/app/',
          publicPath: '/app/'
        }
      }, function (manifest, stats) {
        expect(manifest).toEqual({
          '/app/one.js': '/app/one.' + stats.hash + '.js'
        });

        done();
      });
    });

    it('combines manifests of multiple compilations', function (done) {
      var cache = {};
      webpackCompile([{
        context: __dirname,
        entry: {
          one: './fixtures/file.js'
        }
      }, {
        context: __dirname,
        entry: {
          two: './fixtures/file-two.js'
        }
      }], {
        manifestOptions: {
          cache: cache
        }
      }, function (manifest) {
        expect(manifest).toEqual({
          'one.js': 'one.js',
          'two.js': 'two.js'
        });

        done();
      });
    });

    it('outputs a manifest of no-js file', function (done) {
      webpackCompile({
        context: __dirname,
        entry: './fixtures/file.txt',
        module: {
          loaders: [
            {test: /\.(txt)/, loader: 'file-loader?name=file.[ext]'},
          ]
        }
      }, {}, function (manifest, stats) {
        expect(manifest).toBeDefined();
        expect(manifest).toEqual({
          'main.js': 'main.js',
          'file.txt': 'file.txt'
        });

        done();
      });
    });

  });

  describe('with ExtractTextPlugin', function () {
    it('works when extracting css into a seperate file', function (done) {
      webpackCompile({
        context: __dirname,
        entry: {
          wStyles: [
            './fixtures/file.js',
            './fixtures/style.css'
          ]
        },
        output: {
          filename: '[name].js'
        },
        module: {
          loaders: [{
            test: /\.css$/,
            loader: FakeExtractTextPlugin.extract('style-loader', 'css-loader')
          }]
        },
        plugins: [
          new plugin(),
          new FakeExtractTextPlugin('[name].css', {
            allChunks: true
          })
        ]
      }, {}, function (manifest, stats) {
        expect(manifest).toEqual({
          'wStyles.js': 'wStyles.js',
          'wStyles.css': 'wStyles.css'
        });

        done();
      });
    });
  });

  describe('nameless chunks', function () {
    it('add a literal mapping of files generated by nameless chunks.', function (done) {
      webpackCompile({
        context: __dirname,
        entry: {
          nameless: './fixtures/nameless.js'
        },
        output: {
          filename: '[name].[hash].js'
        }
      }, {}, function(manifest, stats) {
        expect(Object.keys(manifest).length).toEqual(2);
        expect(manifest['nameless.js']).toEqual('nameless.' + stats.hash + '.js');
        done();
      });
    });
  });

  describe('with CopyWebpackPlugin', function () {
    it('works when including assets from third party plugins.', function (done) {
      webpackCompile({
        context: __dirname,
        entry: {
          one: './fixtures/file.js'
        },
        plugins: [
          new FakeCopyWebpackPlugin(),
          new plugin()
        ]
      }, {}, function (manifest, stats) {
        expect(manifest).toEqual({
          'one.js': 'one.js',
          'third.party.js': 'third.party.js'
        });

        done();
      });
    });

    it('doesn\'t add duplicates when prefixes definitions with a base path', function (done) {
      webpackCompile({
        context: __dirname,
        entry: {
          one: './fixtures/file.js',
        },
        output: {
          filename: '[name].[hash].js'
        },
        plugins: [
          new FakeCopyWebpackPlugin(),
          new plugin({
            basePath: '/app/',
            publicPath: '/app/'
          })
        ]
      }, {}, function (manifest, stats) {
        expect(manifest).toEqual({
          '/app/one.js': '/app/one.' + stats.hash + '.js',
          '/app/third.party.js': '/app/third.party.js'
        });

        done();
      });
    });

    it('doesn\'t add duplicates when used with hashes in the filename', function (done) {
      webpackCompile({
        context: __dirname,
        entry: {
          one: './fixtures/file.js',
        },
        output: {
          filename: '[name].[hash].js'
        },
        plugins: [
          new FakeCopyWebpackPlugin(),
          new plugin()
        ]
      }, {}, function(manifest, stats) {
        expect(manifest).toEqual({
          'one.js': 'one.' + stats.hash + '.js',
          'third.party.js': 'third.party.js'
        });

        done();
      });
    });
  });
});
