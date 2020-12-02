const { join } = require('path');

const test = require('ava');
const webpack = require('webpack');

const { WebpackManifestPlugin } = require('../../lib');
const { compile, hashLiteral, readJson, writeFile } = require('../helpers/integration');

const outputPath = join(__dirname, '../output/scoped-hoisting');

test.before(() => {
  writeFile(join(outputPath, 'index.js'), 'import { ReactComponent } from "./logo.svg";');
  writeFile(join(outputPath, 'logo.svg'), '<svg />');
});

test('outputs a manifest', async (t) => {
  const plugins = [new WebpackManifestPlugin()];
  // webpack v4
  if (webpack.optimize.ModuleConcatenationPlugin) {
    plugins.unshift(new webpack.optimize.ModuleConcatenationPlugin());
  }

  const config = {
    context: __dirname,
    entry: '../output/scoped-hoisting/index.js',
    module: {
      rules: [
        {
          test: /\.svg$/,
          use: ['@svgr/webpack', 'file-loader']
        }
      ]
    },
    output: {
      filename: `[name].${hashLiteral}.js`,
      path: outputPath
    },
    plugins
  };
  const stats = await compile(config, {}, t);
  const manifest = readJson(join(outputPath, 'manifest.json'));

  t.truthy(manifest);
  t.is(manifest['main.js'], `main.${stats.hash}.js`);
});
