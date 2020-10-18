// describe('filter', () => {
//   test('should filter out non-initial chunks', (done) => {
//     webpackCompile(
//       {
//         context: __dirname,
//         entry: {
//           nameless: './fixtures/nameless.js'
//         },
//         output: {
//           filename: '[name].[hash].js'
//         }
//       },
//       {
//         manifestOptions: {
//           filter(file) {
//             return file.isInitial;
//           }
//         }
//       },
//       (manifest, stats) => {
//         expect(Object.keys(manifest).length).toEqual(1);
//         expect(manifest['nameless.js']).toEqual(`nameless.${stats.hash}.js`);
//
//         done();
//       }
//     );
//   });
// });
//
// describe('map', () => {
//   test('should allow modifying files defails', (done) => {
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
//           map(file, i) {
//             file.name = i.toString();
//             return file;
//           }
//         }
//       },
//       (manifest) => {
//         expect(manifest).toEqual({
//           0: 'main.js'
//         });
//
//         done();
//       }
//     );
//   });
//
//   test('should add subfolders', (done) => {
//     webpackCompile(
//       {
//         context: __dirname,
//         entry: './fixtures/file.js',
//         output: {
//           filename: 'javascripts/main.js'
//         }
//       },
//       {
//         manifestOptions: {
//           map(file) {
//             file.name = path.join(path.dirname(file.path), file.name);
//             return file;
//           }
//         }
//       },
//       (manifest) => {
//         expect(manifest).toEqual({
//           'javascripts/main.js': 'javascripts/main.js'
//         });
//
//         done();
//       }
//     );
//   });
// });
//
// describe('sort', () => {
//   test('should allow ordering of output', (done) => {
//     webpackCompile(
//       {
//         context: __dirname,
//         entry: {
//           one: './fixtures/file.js',
//           two: './fixtures/file-two.js'
//         },
//         output: {
//           filename: '[name].js'
//         }
//       },
//       {
//         manifestOptions: {
//           seed: [],
//           sort(a) {
//             // make sure one is the latest
//             return a.name === 'one.js' ? 1 : -1;
//           },
//           generate(seed, files) {
//             return files.map((file) => file.name);
//           }
//         }
//       },
//       (manifest) => {
//         expect(manifest).toEqual(['two.js', 'one.js']);
//
//         done();
//       }
//     );
//   });
// });
