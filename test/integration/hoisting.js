const test = require('ava');

test('pass', (t) => t.pass());
// describe('scoped hoisting', () => {
//   beforeAll(() => {
//     fse.outputFileSync(
//       path.join(__dirname, 'output/scoped-hoisting/index.js'),
//       'import { ReactComponent } from "./logo.svg";'
//     );
//     fse.outputFileSync(path.join(__dirname, 'output/scoped-hoisting/logo.svg'), '<svg />');
//   });
//
//   test('outputs a manifest', (done) => {
//     let plugins;
//     if (webpack.optimize.ModuleConcatenationPlugin) {
//       // ModuleConcatenationPlugin works with webpack 3, 4.
//       plugins = [new webpack.optimize.ModuleConcatenationPlugin(), new ManifestPlugin()];
//     } else {
//       plugins = [new ManifestPlugin()];
//     }
//     webpackCompile(
//       {
//         context: __dirname,
//         entry: './output/scoped-hoisting/index.js',
//         module: {
//           rules: [
//             {
//               test: /\.svg$/,
//               use: ['svgr/webpack', 'file-loader']
//             }
//           ]
//         },
//         output: {
//           filename: '[name].[hash].js',
//           path: path.join(__dirname, 'output/scoped-hoisting')
//         },
//         plugins
//       },
//       {},
//       (stats) => {
//         const manifest = fse.readJsonSync(
//           path.join(__dirname, 'output/scoped-hoisting/manifest.json')
//         );
//
//         expect(manifest).toBeDefined();
//         expect(manifest['main.js']).toEqual(`main.${stats.hash}.js`);
//         return done();
//       }
//     );
//   });
// });
