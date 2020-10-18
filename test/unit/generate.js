// describe('generate', () => {
//   test('should generate custom manifest', (done) => {
//     webpackCompile(
//       {
//         context: __dirname,
//         entry: './fixtures/file.js',
//         output: {
//           filename: '[name].js'
//         }
//       },
//       {
//         manifestOptions: {
//           generate(seed, files) {
//             return files.reduce((manifest, file) => {
//               manifest[file.name] = {
//                 file: file.path,
//                 hash: file.chunk.hash
//               };
//               return manifest;
//             }, seed);
//           }
//         }
//       },
//       (manifest, stats) => {
//         expect(manifest).toEqual({
//           'main.js': {
//             file: 'main.js',
//             hash: Array.from(stats.compilation.chunks)[0].hash
//           }
//         });
//
//         done();
//       }
//     );
//   });
//
//   test('should default to `seed`', (done) => {
//     webpackCompile(
//       {
//         context: __dirname,
//         entry: './fixtures/file.js',
//         output: {
//           filename: '[name].js'
//         }
//       },
//       {
//         manifestOptions: {
//           seed: {
//             key: 'value'
//           },
//           generate(seed) {
//             expect(seed).toEqual({
//               key: 'value'
//             });
//             return seed;
//           }
//         }
//       },
//       (manifest) => {
//         expect(manifest).toEqual({
//           key: 'value'
//         });
//
//         done();
//       }
//     );
//   });
//
//   test('should output an array', (done) => {
//     webpackCompile(
//       {
//         context: __dirname,
//         entry: './fixtures/file.js',
//         output: {
//           filename: '[name].js'
//         }
//       },
//       {
//         manifestOptions: {
//           seed: [],
//           generate(seed, files) {
//             return seed.concat(
//               files.map((file) => {
//                 return {
//                   name: file.name,
//                   file: file.path
//                 };
//               })
//             );
//           }
//         }
//       },
//       (manifest) => {
//         expect(manifest).toEqual([
//           {
//             name: 'main.js',
//             file: 'main.js'
//           }
//         ]);
//
//         done();
//       }
//     );
//   });
// });
//
// test('should generate manifest with "entrypoints" key', (done) => {
//   webpackCompile(
//     {
//       context: __dirname,
//       entry: {
//         one: './fixtures/file.js',
//         two: './fixtures/file-two.js'
//       }
//     },
//     {
//       manifestOptions: {
//         generate: (seed, files, entrypoints) => {
//           const manifestFiles = files.reduce(
//             (manifest, { name, path }) => Object.assign(manifest, { [name]: path }),
//             seed
//           );
//           return {
//             files: manifestFiles,
//             entrypoints
//           };
//         }
//       }
//     },
//     (manifest) => {
//       expect(manifest).toEqual({
//         entrypoints: {
//           one: ['one.js'],
//           two: ['two.js']
//         },
//         files: {
//           'one.js': 'one.js',
//           'two.js': 'two.js'
//         }
//       });
//
//       done();
//     }
//   );
// });
