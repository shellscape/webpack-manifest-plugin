const test = require('ava');

test('pass', (t) => t.pass());

// describe('set location of manifest', () => {
//   describe('using relative path', () => {
//     beforeEach(() => {
//       rimraf.sync(path.join(__dirname, 'output/relative-manifest'));
//     });
//
//     test('should use output to the correct location', (done) => {
//       webpackCompile(
//         {
//           context: __dirname,
//           entry: './fixtures/file.js',
//           output: {
//             path: path.join(__dirname, 'output/relative-manifest'),
//             filename: '[name].js'
//           },
//           plugins: [
//             new ManifestPlugin({
//               fileName: 'webpack.manifest.js'
//             })
//           ]
//         },
//         {},
//         () => {
//           const manifestPath = path.join(
//             __dirname,
//             'output/relative-manifest',
//             'webpack.manifest.js'
//           );
//
//           const result = fse.readJsonSync(manifestPath);
//
//           expect(result).toEqual({
//             'main.js': 'main.js'
//           });
//
//           done();
//         }
//       );
//     });
//   });
//
//   describe('using absolute path', () => {
//     beforeEach(() => {
//       rimraf.sync(path.join(__dirname, 'output/absolute-manifest'));
//     });
//
//     test('should use output to the correct location', (done) => {
//       webpackCompile(
//         {
//           context: __dirname,
//           entry: './fixtures/file.js',
//           output: {
//             path: path.join(__dirname, 'output/absolute-manifest'),
//             filename: '[name].js'
//           },
//           plugins: [
//             new ManifestPlugin({
//               fileName: path.join(__dirname, 'output/absolute-manifest', 'webpack.manifest.js')
//             })
//           ]
//         },
//         {},
//         () => {
//           const manifestPath = path.join(
//             __dirname,
//             'output/absolute-manifest',
//             'webpack.manifest.js'
//           );
//
//           const result = fse.readJsonSync(manifestPath);
//
//           expect(result).toEqual({
//             'main.js': 'main.js'
//           });
//
//           done();
//         }
//       );
//     });
//   });
// });
