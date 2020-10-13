const test = require('ava');

test('pass', (t) => t.pass());

// describe('multiple compilation', () => {
//   const nbCompiler = 10;
//   beforeEach(() => {
//     rimraf.sync(path.join(__dirname, 'output/multiple-compilation'));
//   });
//
//   test('should not produce mangle output', (done) => {
//     const seed = {};
//
//     webpackCompile(
//       Array.from({ length: nbCompiler }).map((x, i) => {
//         return {
//           context: __dirname,
//           output: {
//             filename: '[name].js',
//             path: path.join(__dirname, 'output/multiple-compilation')
//           },
//           entry: {
//             [`main-${i}`]: './fixtures/file.js'
//           },
//           plugins: [
//             new ManifestPlugin({
//               seed
//             })
//           ]
//         };
//       }),
//       {},
//       () => {
//         const manifest = fse.readJsonSync(
//           path.join(__dirname, 'output/multiple-compilation/manifest.json')
//         );
//
//         expect(manifest).toBeDefined();
//         expect(manifest).toEqual(
//           Array.from({ length: nbCompiler }).reduce((manifest, x, i) => {
//             manifest[`main-${i}.js`] = `main-${i}.js`;
//
//             return manifest;
//           }, {})
//         );
//
//         done();
//       }
//     );
//   });
// });
//
// describe('multiple manifest', () => {
//   beforeEach(() => {
//     rimraf.sync(path.join(__dirname, 'output/multiple-manifest'));
//   });
//
//   test('should produce two seperate manifests', (done) => {
//     webpackCompile(
//       [
//         {
//           context: __dirname,
//           output: {
//             filename: '[name].js',
//             path: path.join(__dirname, 'output/multiple-manifest/1')
//           },
//           entry: {
//             main: './fixtures/file.js'
//           },
//           plugins: [new ManifestPlugin()]
//         },
//         {
//           context: __dirname,
//           output: {
//             filename: '[name].js',
//             path: path.join(__dirname, 'output/multiple-manifest/2')
//           },
//           entry: {
//             main: './fixtures/file.js'
//           },
//           plugins: [new ManifestPlugin()]
//         }
//       ],
//       {},
//       () => {
//         const manifest1 = fse.readJsonSync(
//           path.join(__dirname, 'output/multiple-manifest/1/manifest.json')
//         );
//         const manifest2 = fse.readJsonSync(
//           path.join(__dirname, 'output/multiple-manifest/2/manifest.json')
//         );
//
//         expect(manifest1).toBeDefined();
//         expect(manifest1).toEqual({
//           'main.js': 'main.js'
//         });
//
//         expect(manifest2).toBeDefined();
//         expect(manifest2).toEqual({
//           'main.js': 'main.js'
//         });
//
//         done();
//       }
//     );
//   });
// });
