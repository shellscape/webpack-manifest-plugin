// const path = require('path');
//
// const { test } = require('ava');
// const MemoryFileSystem = require('memory-fs');
// const webpack = require('webpack');
// const _ = require('lodash');
// const ExtractTextPlugin = require('extract-text-webpack-plugin');
//
// const ManifestPlugin = require('../lib');
//
// const FakeCopyWebpackPlugin = require('./helpers/copy-plugin-mock');
//
// const { isWebpackVersionGte } = require('./helpers/webpack-version-helpers');
//
// const OUTPUT_DIR = path.join(__dirname, './webpack-out');
// const manifestPath = path.join(OUTPUT_DIR, 'manifest.json');
//
// function webpackConfig(webpackOpts, opts) {
//   const defaults = {
//     output: {
//       path: OUTPUT_DIR,
//       filename: '[name].js'
//     },
//     plugins: [new ManifestPlugin(opts.manifestOptions)]
//   };
//   if (isWebpackVersionGte(4)) {
//     defaults.optimization = { chunkIds: 'named' };
//   }
//   return _.merge(defaults, webpackOpts);
// }
//
// function webpackCompile(webpackOpts, opts, cb) {
//   let config;
//   if (Array.isArray(webpackOpts)) {
//     config = webpackOpts.map((x) => webpackConfig(x, opts));
//   } else {
//     config = webpackConfig(webpackOpts, opts);
//   }
//
//   const compiler = webpack(config);
//
//   // eslint-disable-next-line no-multi-assign
//   const fs = (compiler.outputFileSystem = new MemoryFileSystem());
//
//   compiler.run((err, stats) => {
//     let manifestFile;
//     try {
//       manifestFile = JSON.parse(fs.readFileSync(manifestPath).toString());
//     } catch (e) {
//       manifestFile = null;
//     }
//
//     if (err) {
//       throw err;
//     }
//     expect(stats.hasErrors()).toBe(false);
//
//     cb(manifestFile, stats, fs);
//   });
// }
//
// test('exists', () => {
//   expect(ManifestPlugin).toBeDefined();
// });
//
// test('outputs a manifest of one file', (done) => {
//   webpackCompile(
//     {
//       context: __dirname,
//       entry: './fixtures/file.js'
//     },
//     {},
//     (manifest) => {
//       expect(manifest).toBeDefined();
//       expect(manifest).toEqual({
//         'main.js': 'main.js'
//       });
//
//       done();
//     }
//   );
// });
//
// test('outputs a manifest of multiple files', (done) => {
//   webpackCompile(
//     {
//       context: __dirname,
//       entry: {
//         one: './fixtures/file.js',
//         two: './fixtures/file-two.js'
//       }
//     },
//     {},
//     (manifest) => {
//       expect(manifest).toEqual({
//         'one.js': 'one.js',
//         'two.js': 'two.js'
//       });
//
//       done();
//     }
//   );
// });
//
// test('works with hashes in the filename', (done) => {
//   webpackCompile(
//     {
//       context: __dirname,
//       entry: {
//         one: './fixtures/file.js'
//       },
//       output: {
//         filename: '[name].[hash].js'
//       }
//     },
//     {},
//     (manifest, stats) => {
//       expect(manifest).toEqual({
//         'one.js': `one.${stats.hash}.js`
//       });
//
//       done();
//     }
//   );
// });
//
// test('works with source maps', (done) => {
//   webpackCompile(
//     {
//       context: __dirname,
//       devtool: 'sourcemap',
//       entry: {
//         one: './fixtures/file.js'
//       },
//       output: {
//         filename: '[name].js'
//       }
//     },
//     {},
//     (manifest) => {
//       expect(manifest).toEqual({
//         'one.js': 'one.js',
//         'one.js.map': 'one.js.map'
//       });
//
//       done();
//     }
//   );
// });
//
// test('adds seed object custom attributes when provided', (done) => {
//   webpackCompile(
//     {
//       context: __dirname,
//       entry: {
//         one: './fixtures/file.js'
//       },
//       output: {
//         filename: '[name].js'
//       }
//     },
//     {
//       manifestOptions: {
//         seed: {
//           test1: 'test2'
//         }
//       }
//     },
//     (manifest) => {
//       expect(manifest).toEqual({
//         'one.js': 'one.js',
//         test1: 'test2'
//       });
//
//       done();
//     }
//   );
// });
//
// test('combines manifests of multiple compilations', (done) => {
//   webpackCompile(
//     [
//       {
//         context: __dirname,
//         entry: {
//           one: './fixtures/file.js'
//         }
//       },
//       {
//         context: __dirname,
//         entry: {
//           two: './fixtures/file-two.js'
//         }
//       }
//     ],
//     {
//       manifestOptions: {
//         seed: {}
//       }
//     },
//     (manifest) => {
//       expect(manifest).toEqual({
//         'one.js': 'one.js',
//         'two.js': 'two.js'
//       });
//
//       done();
//     }
//   );
// });
//
// test('outputs a manifest of no-js file', (done) => {
//   webpackCompile(
//     {
//       context: __dirname,
//       entry: './fixtures/file.txt',
//       module: isWebpackVersionGte(4)
//         ? {
//             rules: [
//               {
//                 test: /\.(txt)/,
//                 use: [
//                   {
//                     loader: 'file-loader',
//                     options: {
//                       name: '[name].[ext]'
//                     }
//                   }
//                 ]
//               }
//             ]
//           }
//         : {
//             loaders: [{ test: /\.(txt)/, loader: 'file-loader?name=file.[ext]' }]
//           }
//     },
//     {},
//     (manifest) => {
//       expect(manifest).toBeDefined();
//       expect(manifest).toEqual({
//         'main.js': 'main.js',
//         'file.txt': 'file.txt'
//       });
//
//       done();
//     }
//   );
// });
//
// // Webpack 5 doesn't include file content in stats.compilation.assets
// if (!isWebpackVersionGte(5)) {
//   test('make manifest available to other webpack plugins', (done) => {
//     webpackCompile(
//       {
//         context: __dirname,
//         entry: './fixtures/file.js'
//       },
//       {},
//       (manifest, stats) => {
//         expect(manifest).toEqual({
//           'main.js': 'main.js'
//         });
//
//         expect(JSON.parse(stats.compilation.assets['manifest.json'].source())).toEqual({
//           'main.js': 'main.js'
//         });
//
//         done();
//       }
//     );
//   });
// }
