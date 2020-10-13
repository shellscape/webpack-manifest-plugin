// describe('with CopyWebpackPlugin', () => {
//   test('works when including copied assets', (done) => {
//     webpackCompile(
//       {
//         context: __dirname,
//         entry: {
//           one: './fixtures/file.js'
//         },
//         plugins: [new FakeCopyWebpackPlugin(), new ManifestPlugin()]
//       },
//       {},
//       (manifest) => {
//         expect(manifest).toEqual({
//           'one.js': 'one.js',
//           'third.party.js': 'third.party.js'
//         });
//
//         done();
//       }
//     );
//   });
//
//   it("doesn't add duplicates when prefixes definitions with a base path", (done) => {
//     webpackCompile(
//       {
//         context: __dirname,
//         entry: {
//           one: './fixtures/file.js'
//         },
//         output: {
//           filename: '[name].[hash].js',
//           publicPath: '/app/'
//         },
//         plugins: [
//           new FakeCopyWebpackPlugin(),
//           new ManifestPlugin({
//             basePath: '/app/'
//           })
//         ]
//       },
//       {},
//       (manifest, stats) => {
//         expect(manifest).toEqual({
//           '/app/one.js': `/app/one.${stats.hash}.js`,
//           '/app/third.party.js': '/app/third.party.js'
//         });
//
//         done();
//       }
//     );
//   });
//
//   it("doesn't add duplicates when used with hashes in the filename", (done) => {
//     webpackCompile(
//       {
//         context: __dirname,
//         entry: {
//           one: './fixtures/file.js'
//         },
//         output: {
//           filename: '[name].[hash].js'
//         },
//         plugins: [new FakeCopyWebpackPlugin(), new ManifestPlugin()]
//       },
//       {},
//       (manifest, stats) => {
//         expect(manifest).toEqual({
//           'one.js': `one.${stats.hash}.js`,
//           'third.party.js': 'third.party.js'
//         });
//
//         done();
//       }
//     );
//   });
//
//   test('supports custom serializer using serialize option', (done) => {
//     webpackCompile(
//       {
//         context: __dirname,
//         entry: './fixtures/file.js'
//       },
//       {
//         manifestOptions: {
//           fileName: 'webpack.manifest.yml',
//           serialize(manifest) {
//             let output = '';
//             // eslint-disable-next-line guard-for-in
//             for (const key in manifest) {
//               output += `- ${key}: "${manifest[key]}"\n`;
//             }
//             return output;
//           }
//         }
//       },
//       (manifest, stats, fs) => {
//         const OUTPUT_DIR = path.join(__dirname, './webpack-out');
//         const manifestPath = path.join(OUTPUT_DIR, 'webpack.manifest.yml');
//         const result = fs.readFileSync(manifestPath).toString();
//
//         expect(result).toEqual('- main.js: "main.js"\n');
//
//         done();
//       }
//     );
//   });
// });
