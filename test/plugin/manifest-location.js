// describe('set location of manifest', () => {
//   describe('using relative path', () => {
//     test('should use output to the correct location', (done) => {
//       webpackCompile(
//         {
//           context: __dirname,
//           entry: './fixtures/file.js'
//         },
//         {
//           manifestOptions: {
//             fileName: 'webpack.manifest.js'
//           }
//         },
//         (manifest, stats, fs) => {
//           const OUTPUT_DIR = path.join(__dirname, './webpack-out');
//           const manifestPath = path.join(OUTPUT_DIR, 'webpack.manifest.js');
//           const result = JSON.parse(fs.readFileSync(manifestPath).toString());
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
//     test('should use output to the correct location', (done) => {
//       webpackCompile(
//         {
//           context: __dirname,
//           entry: './fixtures/file.js'
//         },
//         {
//           manifestOptions: {
//             fileName: path.join(__dirname, 'webpack.manifest.js')
//           }
//         },
//         (manifest, stats, fs) => {
//           const manifestPath = path.join(__dirname, 'webpack.manifest.js');
//           const result = JSON.parse(fs.readFileSync(manifestPath).toString());
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
