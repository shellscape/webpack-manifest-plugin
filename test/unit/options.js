const { join } = require('path');

const test = require('ava');
const CopyPlugin = require('copy-webpack-plugin');
const del = require('del');

const { compile } = require('../helpers/unit');

const outputPath = join(__dirname, '../output/options');

test.after(() => del(outputPath));

test('removeKeyHash', async (t) => {
  const config = {
    context: __dirname,
    entry: '../fixtures/file.js',
    output: {
      filename: '[contenthash].removeKeyHash.js',
      path: join(outputPath, 'options')
    },
    plugins: [
      new CopyPlugin({
        patterns: [
          { from: '../fixtures/*.css', to: '[name].[contenthash].[ext]' },
          { from: '../fixtures/*.txt', to: '[contenthash].[name].[ext]' }
        ]
      })
    ]
  };

  let { manifest } = await compile(config, t);

  t.snapshot(manifest);

  ({ manifest } = await compile(config, t, { removeKeyHash: false }));

  t.snapshot(manifest);
});
