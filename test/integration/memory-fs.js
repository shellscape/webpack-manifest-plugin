const test = require('ava');

test('pass', (t) => t.pass());

// const MemoryFileSystem = require('memory-fs');
//
// beforeEach(() => {
//   rimraf.sync(path.join(__dirname, 'output/emit'));
// });
//
// test('outputs a manifest of one file', (done) => {
//   webpackCompile(
//     {
//       context: __dirname,
//       output: {
//         filename: '[name].js',
//         path: path.join(__dirname, 'output/emit')
//       },
//       entry: './fixtures/file.js',
//       plugins: [
//         new ManifestPlugin({
//           writeToFileEmit: true
//         })
//       ]
//     },
//     {
//       outputFileSystem: new MemoryFileSystem()
//     },
//     () => {
//       const manifest = fse.readJsonSync(path.join(__dirname, 'output/emit/manifest.json'));
//
//       expect(manifest).toBeDefined();
//       expect(manifest).toEqual({
//         'main.js': 'main.js'
//       });
//
//       done();
//     }
//   );
// });
