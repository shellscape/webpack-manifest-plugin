// test('does not prefix seed attributes with basePath', (done) => {
//   webpackCompile(
//     {
//       context: __dirname,
//       entry: {
//         one: './fixtures/file.js'
//       },
//       output: {
//         filename: '[name].[hash].js',
//         publicPath: '/app/'
//       }
//     },
//     {
//       manifestOptions: {
//         basePath: '/app/',
//         seed: {
//           test1: 'test2'
//         }
//       }
//     },
//     (manifest, stats) => {
//       expect(manifest).toEqual({
//         '/app/one.js': `/app/one.${stats.hash}.js`,
//         test1: 'test2'
//       });
//
//       done();
//     }
//   );
// });
//
// test('prefixes definitions with a base path', (done) => {
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
//     {
//       manifestOptions: {
//         basePath: '/app/'
//       }
//     },
//     (manifest, stats) => {
//       expect(manifest).toEqual({
//         '/app/one.js': `one.${stats.hash}.js`
//       });
//
//       done();
//     }
//   );
// });
//
// describe('publicPath', () => {
//   test('prefixes paths with a public path', (done) => {
//     webpackCompile(
//       {
//         context: __dirname,
//         entry: {
//           one: './fixtures/file.js'
//         },
//         output: {
//           filename: '[name].[hash].js',
//           publicPath: '/app/'
//         }
//       },
//       {},
//       (manifest, stats) => {
//         expect(manifest).toEqual({
//           'one.js': `/app/one.${stats.hash}.js`
//         });
//
//         done();
//       }
//     );
//   });
//
//   test('is possible to overrides publicPath', (done) => {
//     webpackCompile(
//       {
//         context: __dirname,
//         entry: {
//           one: './fixtures/file.js'
//         },
//         output: {
//           filename: '[name].[hash].js',
//           publicPath: '/app/'
//         }
//       },
//       {
//         manifestOptions: {
//           publicPath: ''
//         }
//       },
//       (manifest, stats) => {
//         expect(manifest).toEqual({
//           'one.js': `one.${stats.hash}.js`
//         });
//
//         done();
//       }
//     );
//   });
// });
//
// test('prefixes definitions with a base path when public path is also provided', (done) => {
//   webpackCompile(
//     {
//       context: __dirname,
//       entry: {
//         one: './fixtures/file.js'
//       },
//       output: {
//         filename: '[name].[hash].js',
//         publicPath: '/app/'
//       }
//     },
//     {
//       manifestOptions: {
//         basePath: '/app/'
//       }
//     },
//     (manifest, stats) => {
//       expect(manifest).toEqual({
//         '/app/one.js': `/app/one.${stats.hash}.js`
//       });
//
//       done();
//     }
//   );
// });
//
// test('should keep full urls provided by basePath', (done) => {
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
//         basePath: 'https://www/example.com/'
//       }
//     },
//     (manifest) => {
//       expect(manifest).toEqual({
//         'https://www/example.com/one.js': 'one.js'
//       });
//
//       done();
//     }
//   );
// });
//
// test('should keep full urls provided by publicPath', (done) => {
//   webpackCompile(
//     {
//       context: __dirname,
//       entry: {
//         one: './fixtures/file.js'
//       },
//       output: {
//         filename: '[name].js',
//         publicPath: 'http://www/example.com/'
//       }
//     },
//     {},
//     (manifest) => {
//       expect(manifest).toEqual({
//         'one.js': 'http://www/example.com/one.js'
//       });
//
//       done();
//     }
//   );
// });
//
// test('ensures the manifest is mapping paths to names', (done) => {
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
//                       name: 'outputfile.[ext]'
//                     }
//                   }
//                 ]
//               }
//             ]
//           }
//         : {
//             loaders: [{ test: /\.(txt)/, loader: 'file-loader?name=outputfile.[ext]' }]
//           }
//     },
//     {},
//     (manifest) => {
//       expect(manifest).toBeDefined();
//       expect(manifest).toEqual({
//         'main.js': 'main.js',
//         'file.txt': 'outputfile.txt'
//       });
//
//       done();
//     }
//   );
// });
//
// test('should output unix paths', (done) => {
//   webpackCompile(
//     {
//       context: __dirname,
//       entry: {
//         'dir\\main': './fixtures/file.js',
//         'some\\dir\\main': './fixtures/file.js'
//       }
//     },
//     {},
//     (manifest) => {
//       expect(manifest).toBeDefined();
//       expect(manifest).toEqual({
//         'dir/main.js': 'dir/main.js',
//         'some/dir/main.js': 'some/dir/main.js'
//       });
//
//       done();
//     }
//   );
// });
