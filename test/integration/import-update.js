const test = require('ava');

test('pass', (t) => t.pass());

// describe('import() update', () => {
//   let compiler;
//   let isFirstRun;
//
//   beforeAll(() => {
//     fse.outputFileSync(
//       path.join(__dirname, 'output/watch-import-chunk/chunk1.js'),
//       "console.log('chunk 1')"
//     );
//     fse.outputFileSync(
//       path.join(__dirname, 'output/watch-import-chunk/chunk2.js'),
//       "console.log('chunk 2')"
//     );
//     fse.outputFileSync(
//       path.join(__dirname, 'output/watch-import-chunk/index.js'),
//       "import('./chunk1')\nimport('./chunk2')"
//     );
//     isFirstRun = true;
//   });
//
//   afterAll((done) => {
//     compiler.close(done);
//   });
//
//   test('outputs a manifest of one file', (done) => {
//     compiler = webpackWatch(
//       {
//         context: __dirname,
//         output: {
//           filename: '[name].js',
//           path: path.join(__dirname, 'output/watch-import-chunk')
//         },
//         entry: './output/watch-import-chunk/index.js',
//         watch: true,
//         plugins: [new ManifestPlugin(), new webpack.HotModuleReplacementPlugin()]
//       },
//       {},
//       () => {
//         const manifest = fse.readJsonSync(
//           path.join(__dirname, 'output/watch-import-chunk/manifest.json')
//         );
//
//         expect(manifest).toBeDefined();
//
//         if (isFirstRun) {
//           expect(manifest).toEqual(
//             isWebpackVersionGte(5)
//               ? {
//                   'main.js': 'main.js',
//                   '0.js': '0.js',
//                   '2.js': '2.js'
//                 }
//               : isWebpackVersionGte(4)
//               ? {
//                   'main.js': 'main.js',
//                   '1.js': '1.js',
//                   '2.js': '2.js'
//                 }
//               : {
//                   'main.js': 'main.js',
//                   '0.js': '0.js',
//                   '1.js': '1.js'
//                 }
//           );
//
//           isFirstRun = false;
//           fse.outputFileSync(
//             path.join(__dirname, 'output/watch-import-chunk/index.js'),
//             "import('./chunk1')"
//           );
//         } else {
//           expect(manifest).toEqual(
//             isWebpackVersionGte(5)
//               ? {
//                   'main.js': 'main.js',
//                   '2.js': '2.js'
//                 }
//               : isWebpackVersionGte(4)
//               ? {
//                   'main.js': 'main.js',
//                   '1.js': '1.js'
//                 }
//               : {
//                   'main.js': 'main.js',
//                   '3.js': '3.js'
//                 }
//           );
//
//           done();
//         }
//       }
//     );
//   });
// });
