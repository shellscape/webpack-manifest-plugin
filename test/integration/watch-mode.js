const test = require('ava');

test('pass', (t) => t.pass());

// describe('watch mode', () => {
//   let compiler;
//   let hashes;
//
//   beforeAll(() => {
//     fse.outputFileSync(path.join(__dirname, 'output/watch-mode/index.js'), "console.log('v1')");
//     hashes = [];
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
//           filename: '[name].[hash].js',
//           path: path.join(__dirname, 'output/watch-mode')
//         },
//         entry: './output/watch-mode/index.js',
//         watch: true,
//         plugins: [new ManifestPlugin(), new webpack.HotModuleReplacementPlugin()]
//       },
//       {},
//       // eslint-disable-next-line consistent-return
//       (stats) => {
//         const manifest = fse.readJsonSync(path.join(__dirname, 'output/watch-mode/manifest.json'));
//
//         expect(manifest).toBeDefined();
//         expect(manifest).toEqual({
//           'main.js': `main.${stats.hash}.js`
//         });
//
//         hashes.push(stats.hash);
//
//         if (hashes.length === 2) {
//           expect(hashes[0]).not.toEqual(hashes[1]);
//           return done();
//         }
//
//         fse.outputFileSync(path.join(__dirname, 'output/watch-mode/index.js'), "console.log('v2')");
//       }
//     );
//   });
// });
