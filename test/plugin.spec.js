const path = require('path');

const MemoryFileSystem = require('memory-fs');
const webpack = require('webpack');
const _ = require('lodash');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const plugin = require('../index.js');

const FakeCopyWebpackPlugin = require('./helpers/copy-plugin-mock');

const { emittedAsset, isWebpackVersionGte } = require('./helpers/webpack-version-helpers');

const OUTPUT_DIR = path.join(__dirname, './webpack-out');
const manifestPath = path.join(OUTPUT_DIR, 'manifest.json');

function webpackConfig(webpackOpts, opts) {
  const defaults = {
    output: {
      path: OUTPUT_DIR,
      filename: '[name].js'
    },
    plugins: [new plugin(opts.manifestOptions)]
  };
  if (isWebpackVersionGte(4)) {
    defaults.optimization = { chunkIds: 'named' };
  }
  return _.merge(defaults, webpackOpts);
}

function webpackCompile(webpackOpts, opts, cb) {
  let config;
  if (Array.isArray(webpackOpts)) {
    config = webpackOpts.map((x) => webpackConfig(x, opts));
  } else {
    config = webpackConfig(webpackOpts, opts);
  }

  const compiler = webpack(config);

  const fs = (compiler.outputFileSystem = new MemoryFileSystem());

  compiler.run((err, stats) => {
    let manifestFile;
    try {
      manifestFile = JSON.parse(fs.readFileSync(manifestPath).toString());
    } catch (e) {
      manifestFile = null;
    }

    if (err) {
      throw err;
    }
    expect(stats.hasErrors()).toBe(false);

    cb(manifestFile, stats, fs);
  });
}

describe('ManifestPlugin', () => {
  it('exists', () => {
    expect(plugin).toBeDefined();
  });

  describe('basic behavior', () => {
    it('outputs a manifest of one file', (done) => {
      webpackCompile(
        {
          context: __dirname,
          entry: './fixtures/file.js'
        },
        {},
        (manifest) => {
          expect(manifest).toBeDefined();
          expect(manifest).toEqual({
            'main.js': 'main.js'
          });

          done();
        }
      );
    });

    it('outputs a manifest of multiple files', (done) => {
      webpackCompile(
        {
          context: __dirname,
          entry: {
            one: './fixtures/file.js',
            two: './fixtures/file-two.js'
          }
        },
        {},
        (manifest) => {
          expect(manifest).toEqual({
            'one.js': 'one.js',
            'two.js': 'two.js'
          });

          done();
        }
      );
    });

    it('works with hashes in the filename', (done) => {
      webpackCompile(
        {
          context: __dirname,
          entry: {
            one: './fixtures/file.js'
          },
          output: {
            filename: '[name].[hash].js'
          }
        },
        {},
        (manifest, stats) => {
          expect(manifest).toEqual({
            'one.js': `one.${stats.hash}.js`
          });

          done();
        }
      );
    });

    it('works with source maps', (done) => {
      webpackCompile(
        {
          context: __dirname,
          devtool: 'sourcemap',
          entry: {
            one: './fixtures/file.js'
          },
          output: {
            filename: '[name].js'
          }
        },
        {},
        (manifest, stats) => {
          expect(manifest).toEqual({
            'one.js': 'one.js',
            'one.js.map': 'one.js.map'
          });

          done();
        }
      );
    });

    it('prefixes definitions with a base path', (done) => {
      webpackCompile(
        {
          context: __dirname,
          entry: {
            one: './fixtures/file.js'
          },
          output: {
            filename: '[name].[hash].js'
          }
        },
        {
          manifestOptions: {
            basePath: '/app/'
          }
        },
        (manifest, stats) => {
          expect(manifest).toEqual({
            '/app/one.js': `one.${stats.hash}.js`
          });

          done();
        }
      );
    });

    describe('publicPath', () => {
      it('prefixes paths with a public path', (done) => {
        webpackCompile(
          {
            context: __dirname,
            entry: {
              one: './fixtures/file.js'
            },
            output: {
              filename: '[name].[hash].js',
              publicPath: '/app/'
            }
          },
          {},
          (manifest, stats) => {
            expect(manifest).toEqual({
              'one.js': `/app/one.${stats.hash}.js`
            });

            done();
          }
        );
      });

      it('is possible to overrides publicPath', (done) => {
        webpackCompile(
          {
            context: __dirname,
            entry: {
              one: './fixtures/file.js'
            },
            output: {
              filename: '[name].[hash].js',
              publicPath: '/app/'
            }
          },
          {
            manifestOptions: {
              publicPath: ''
            }
          },
          (manifest, stats) => {
            expect(manifest).toEqual({
              'one.js': `one.${stats.hash}.js`
            });

            done();
          }
        );
      });
    });

    it('prefixes definitions with a base path when public path is also provided', (done) => {
      webpackCompile(
        {
          context: __dirname,
          entry: {
            one: './fixtures/file.js'
          },
          output: {
            filename: '[name].[hash].js',
            publicPath: '/app/'
          }
        },
        {
          manifestOptions: {
            basePath: '/app/'
          }
        },
        (manifest, stats) => {
          expect(manifest).toEqual({
            '/app/one.js': `/app/one.${stats.hash}.js`
          });

          done();
        }
      );
    });

    it('should keep full urls provided by basePath', (done) => {
      webpackCompile(
        {
          context: __dirname,
          entry: {
            one: './fixtures/file.js'
          },
          output: {
            filename: '[name].js'
          }
        },
        {
          manifestOptions: {
            basePath: 'https://www/example.com/'
          }
        },
        (manifest, stats) => {
          expect(manifest).toEqual({
            'https://www/example.com/one.js': 'one.js'
          });

          done();
        }
      );
    });

    it('should keep full urls provided by publicPath', (done) => {
      webpackCompile(
        {
          context: __dirname,
          entry: {
            one: './fixtures/file.js'
          },
          output: {
            filename: '[name].js',
            publicPath: 'http://www/example.com/'
          }
        },
        {},
        (manifest, stats) => {
          expect(manifest).toEqual({
            'one.js': 'http://www/example.com/one.js'
          });

          done();
        }
      );
    });

    it('adds seed object custom attributes when provided', (done) => {
      webpackCompile(
        {
          context: __dirname,
          entry: {
            one: './fixtures/file.js'
          },
          output: {
            filename: '[name].js'
          }
        },
        {
          manifestOptions: {
            seed: {
              test1: 'test2'
            }
          }
        },
        (manifest) => {
          expect(manifest).toEqual({
            'one.js': 'one.js',
            test1: 'test2'
          });

          done();
        }
      );
    });

    it('does not prefix seed attributes with basePath', (done) => {
      webpackCompile(
        {
          context: __dirname,
          entry: {
            one: './fixtures/file.js'
          },
          output: {
            filename: '[name].[hash].js',
            publicPath: '/app/'
          }
        },
        {
          manifestOptions: {
            basePath: '/app/',
            seed: {
              test1: 'test2'
            }
          }
        },
        (manifest, stats) => {
          expect(manifest).toEqual({
            '/app/one.js': `/app/one.${stats.hash}.js`,
            test1: 'test2'
          });

          done();
        }
      );
    });

    it('combines manifests of multiple compilations', (done) => {
      webpackCompile(
        [
          {
            context: __dirname,
            entry: {
              one: './fixtures/file.js'
            }
          },
          {
            context: __dirname,
            entry: {
              two: './fixtures/file-two.js'
            }
          }
        ],
        {
          manifestOptions: {
            seed: {}
          }
        },
        (manifest) => {
          expect(manifest).toEqual({
            'one.js': 'one.js',
            'two.js': 'two.js'
          });

          done();
        }
      );
    });

    it('outputs a manifest of no-js file', (done) => {
      webpackCompile(
        {
          context: __dirname,
          entry: './fixtures/file.txt',
          module: isWebpackVersionGte(4)
            ? {
                rules: [
                  {
                    test: /\.(txt)/,
                    use: [
                      {
                        loader: 'file-loader',
                        options: {
                          name: '[name].[ext]'
                        }
                      }
                    ]
                  }
                ]
              }
            : {
                loaders: [{ test: /\.(txt)/, loader: 'file-loader?name=file.[ext]' }]
              }
        },
        {},
        (manifest, stats) => {
          expect(manifest).toBeDefined();
          expect(manifest).toEqual({
            'main.js': 'main.js',
            'file.txt': 'file.txt'
          });

          done();
        }
      );
    });

    it('ensures the manifest is mapping paths to names', (done) => {
      webpackCompile(
        {
          context: __dirname,
          entry: './fixtures/file.txt',
          module: isWebpackVersionGte(4)
            ? {
                rules: [
                  {
                    test: /\.(txt)/,
                    use: [
                      {
                        loader: 'file-loader',
                        options: {
                          name: 'outputfile.[ext]'
                        }
                      }
                    ]
                  }
                ]
              }
            : {
                loaders: [{ test: /\.(txt)/, loader: 'file-loader?name=outputfile.[ext]' }]
              }
        },
        {},
        (manifest, stats) => {
          expect(manifest).toBeDefined();
          expect(manifest).toEqual({
            'main.js': 'main.js',
            'file.txt': 'outputfile.txt'
          });

          done();
        }
      );
    });

    // Webpack 5 doesn't include file content in stats.compilation.assets
    if (!isWebpackVersionGte(5)) {
      it('make manifest available to other webpack plugins', (done) => {
        webpackCompile(
          {
            context: __dirname,
            entry: './fixtures/file.js'
          },
          {},
          (manifest, stats) => {
            expect(manifest).toEqual({
              'main.js': 'main.js'
            });

            expect(JSON.parse(stats.compilation.assets['manifest.json'].source())).toEqual({
              'main.js': 'main.js'
            });

            done();
          }
        );
      });
    }

    it('should output unix paths', (done) => {
      webpackCompile(
        {
          context: __dirname,
          entry: {
            'dir\\main': './fixtures/file.js',
            'some\\dir\\main': './fixtures/file.js'
          }
        },
        {},
        (manifest) => {
          expect(manifest).toBeDefined();
          expect(manifest).toEqual({
            'dir/main.js': 'dir/main.js',
            'some/dir/main.js': 'some/dir/main.js'
          });

          done();
        }
      );
    });
  });

  // Skip ExtractTextPlugin checks until it supports Webpack 5
  if (!isWebpackVersionGte(5)) {
    describe('with ExtractTextPlugin', () => {
      it('works when extracting css into a seperate file', (done) => {
        webpackCompile(
          {
            context: __dirname,
            entry: {
              wStyles: ['./fixtures/file.js', './fixtures/style.css']
            },
            output: {
              filename: '[name].js'
            },
            module: isWebpackVersionGte(4)
              ? {
                  rules: [
                    {
                      test: /\.css$/,
                      use: ExtractTextPlugin.extract({
                        fallback: 'style-loader',
                        use: 'css-loader'
                      })
                    }
                  ]
                }
              : {
                  loaders: [
                    {
                      test: /\.css$/,
                      loader: ExtractTextPlugin.extract({
                        fallback: 'style-loader',
                        use: 'css-loader'
                      })
                    }
                  ]
                },
            plugins: [
              new plugin(),
              new ExtractTextPlugin({
                filename: '[name].css',
                allChunks: true
              })
            ]
          },
          {},
          (manifest, stats) => {
            expect(manifest).toEqual({
              'wStyles.js': 'wStyles.js',
              'wStyles.css': 'wStyles.css'
            });

            done();
          }
        );
      });
    });
  }

  describe('nameless chunks', () => {
    it('add a literal mapping of files generated by nameless chunks.', (done) => {
      webpackCompile(
        {
          context: __dirname,
          entry: {
            nameless: './fixtures/nameless.js'
          },
          output: {
            filename: '[name].[hash].js'
          }
        },
        {},
        (manifest, stats) => {
          expect(Object.keys(manifest).length).toEqual(2);
          expect(manifest['nameless.js']).toEqual(`nameless.${stats.hash}.js`);

          done();
        }
      );
    });
  });

  describe('set location of manifest', () => {
    describe('using relative path', () => {
      it('should use output to the correct location', (done) => {
        webpackCompile(
          {
            context: __dirname,
            entry: './fixtures/file.js'
          },
          {
            manifestOptions: {
              fileName: 'webpack.manifest.js'
            }
          },
          (manifest, stats, fs) => {
            const OUTPUT_DIR = path.join(__dirname, './webpack-out');
            const manifestPath = path.join(OUTPUT_DIR, 'webpack.manifest.js');

            var manifest = JSON.parse(fs.readFileSync(manifestPath).toString());

            expect(manifest).toEqual({
              'main.js': 'main.js'
            });

            done();
          }
        );
      });
    });

    describe('using absolute path', () => {
      it('should use output to the correct location', (done) => {
        webpackCompile(
          {
            context: __dirname,
            entry: './fixtures/file.js'
          },
          {
            manifestOptions: {
              fileName: path.join(__dirname, 'webpack.manifest.js')
            }
          },
          (manifest, stats, fs) => {
            const manifestPath = path.join(__dirname, 'webpack.manifest.js');

            var manifest = JSON.parse(fs.readFileSync(manifestPath).toString());

            expect(manifest).toEqual({
              'main.js': 'main.js'
            });

            done();
          }
        );
      });
    });
  });

  describe('filter', () => {
    it('should filter out non-initial chunks', (done) => {
      webpackCompile(
        {
          context: __dirname,
          entry: {
            nameless: './fixtures/nameless.js'
          },
          output: {
            filename: '[name].[hash].js'
          }
        },
        {
          manifestOptions: {
            filter(file) {
              return file.isInitial;
            }
          }
        },
        (manifest, stats) => {
          expect(Object.keys(manifest).length).toEqual(1);
          expect(manifest['nameless.js']).toEqual(`nameless.${stats.hash}.js`);

          done();
        }
      );
    });
  });

  describe('map', () => {
    it('should allow modifying files defails', (done) => {
      webpackCompile(
        {
          context: __dirname,
          entry: './fixtures/file.js',
          output: {
            filename: '[name].js'
          }
        },
        {
          manifestOptions: {
            map(file, i) {
              file.name = i.toString();
              return file;
            }
          }
        },
        (manifest, stats) => {
          expect(manifest).toEqual({
            0: 'main.js'
          });

          done();
        }
      );
    });

    it('should add subfolders', (done) => {
      webpackCompile(
        {
          context: __dirname,
          entry: './fixtures/file.js',
          output: {
            filename: 'javascripts/main.js'
          }
        },
        {
          manifestOptions: {
            map(file) {
              file.name = path.join(path.dirname(file.path), file.name);
              return file;
            }
          }
        },
        (manifest) => {
          expect(manifest).toEqual({
            'javascripts/main.js': 'javascripts/main.js'
          });

          done();
        }
      );
    });
  });

  describe('sort', () => {
    it('should allow ordering of output', (done) => {
      webpackCompile(
        {
          context: __dirname,
          entry: {
            one: './fixtures/file.js',
            two: './fixtures/file-two.js'
          },
          output: {
            filename: '[name].js'
          }
        },
        {
          manifestOptions: {
            seed: [],
            sort(a, b) {
              // make sure one is the latest
              return a.name === 'one.js' ? 1 : -1;
            },
            generate(seed, files) {
              return files.map((file) => file.name);
            }
          }
        },
        (manifest, stats) => {
          expect(manifest).toEqual(['two.js', 'one.js']);

          done();
        }
      );
    });
  });

  describe('generate', () => {
    it('should generate custom manifest', (done) => {
      webpackCompile(
        {
          context: __dirname,
          entry: './fixtures/file.js',
          output: {
            filename: '[name].js'
          }
        },
        {
          manifestOptions: {
            generate(seed, files) {
              return files.reduce((manifest, file) => {
                manifest[file.name] = {
                  file: file.path,
                  hash: file.chunk.hash
                };
                return manifest;
              }, seed);
            }
          }
        },
        (manifest, stats) => {
          expect(manifest).toEqual({
            'main.js': {
              file: 'main.js',
              hash: Array.from(stats.compilation.chunks)[0].hash
            }
          });

          done();
        }
      );
    });

    it('should default to `seed`', (done) => {
      webpackCompile(
        {
          context: __dirname,
          entry: './fixtures/file.js',
          output: {
            filename: '[name].js'
          }
        },
        {
          manifestOptions: {
            seed: {
              key: 'value'
            },
            generate(seed) {
              expect(seed).toEqual({
                key: 'value'
              });
              return seed;
            }
          }
        },
        (manifest, stats) => {
          expect(manifest).toEqual({
            key: 'value'
          });

          done();
        }
      );
    });

    it('should output an array', (done) => {
      webpackCompile(
        {
          context: __dirname,
          entry: './fixtures/file.js',
          output: {
            filename: '[name].js'
          }
        },
        {
          manifestOptions: {
            seed: [],
            generate(seed, files) {
              return seed.concat(
                files.map((file) => {
                  return {
                    name: file.name,
                    file: file.path
                  };
                })
              );
            }
          }
        },
        (manifest, stats) => {
          expect(manifest).toEqual([
            {
              name: 'main.js',
              file: 'main.js'
            }
          ]);

          done();
        }
      );
    });
  });

  it('should generate manifest with "entrypoints" key', (done) => {
    webpackCompile(
      {
        context: __dirname,
        entry: {
          one: './fixtures/file.js',
          two: './fixtures/file-two.js'
        }
      },
      {
        manifestOptions: {
          generate: (seed, files, entrypoints) => {
            const manifestFiles = files.reduce(
              (manifest, { name, path }) => Object.assign(manifest, { [name]: path }),
              seed
            );
            return {
              files: manifestFiles,
              entrypoints
            };
          }
        }
      },
      (manifest, stats) => {
        expect(manifest).toEqual({
          entrypoints: {
            one: ['one.js'],
            two: ['two.js']
          },
          files: {
            'one.js': 'one.js',
            'two.js': 'two.js'
          }
        });

        done();
      }
    );
  });

  describe('with CopyWebpackPlugin', () => {
    it('works when including copied assets', (done) => {
      webpackCompile(
        {
          context: __dirname,
          entry: {
            one: './fixtures/file.js'
          },
          plugins: [new FakeCopyWebpackPlugin(), new plugin()]
        },
        {},
        (manifest, stats) => {
          expect(manifest).toEqual({
            'one.js': 'one.js',
            'third.party.js': 'third.party.js'
          });

          done();
        }
      );
    });

    it("doesn't add duplicates when prefixes definitions with a base path", (done) => {
      webpackCompile(
        {
          context: __dirname,
          entry: {
            one: './fixtures/file.js'
          },
          output: {
            filename: '[name].[hash].js',
            publicPath: '/app/'
          },
          plugins: [
            new FakeCopyWebpackPlugin(),
            new plugin({
              basePath: '/app/'
            })
          ]
        },
        {},
        (manifest, stats) => {
          expect(manifest).toEqual({
            '/app/one.js': `/app/one.${stats.hash}.js`,
            '/app/third.party.js': '/app/third.party.js'
          });

          done();
        }
      );
    });

    it("doesn't add duplicates when used with hashes in the filename", (done) => {
      webpackCompile(
        {
          context: __dirname,
          entry: {
            one: './fixtures/file.js'
          },
          output: {
            filename: '[name].[hash].js'
          },
          plugins: [new FakeCopyWebpackPlugin(), new plugin()]
        },
        {},
        (manifest, stats) => {
          expect(manifest).toEqual({
            'one.js': `one.${stats.hash}.js`,
            'third.party.js': 'third.party.js'
          });

          done();
        }
      );
    });

    it('supports custom serializer using serialize option', (done) => {
      webpackCompile(
        {
          context: __dirname,
          entry: './fixtures/file.js'
        },
        {
          manifestOptions: {
            fileName: 'webpack.manifest.yml',
            serialize(manifest) {
              let output = '';
              for (const key in manifest) {
                output += `- ${key}: "${manifest[key]}"\n`;
              }
              return output;
            }
          }
        },
        (manifest, stats, fs) => {
          const OUTPUT_DIR = path.join(__dirname, './webpack-out');
          const manifestPath = path.join(OUTPUT_DIR, 'webpack.manifest.yml');

          var manifest = fs.readFileSync(manifestPath).toString();

          expect(manifest).toEqual('- main.js: "main.js"\n');

          done();
        }
      );
    });
  });
});
