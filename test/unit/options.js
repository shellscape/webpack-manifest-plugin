const { join } = require('path');

const test = require('ava');
const CopyPlugin = require('copy-webpack-plugin');
const del = require('del');

const { compile } = require('../helpers/unit');

const outputPath = join(__dirname, '../output/options');

test.after(() => del(outputPath));

const clean = (what) => what.replace(/([a-f0-9]{20,32})/gi, '[test-hash]');

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

  manifest = Object.keys(manifest).reduce((prev, key) => {
    prev[clean(key)] = clean(manifest[key]);
    return prev;
  }, {});

  t.snapshot(manifest);

  ({ manifest } = await compile(config, t, { removeKeyHash: false }));

  manifest = Object.keys(manifest).reduce((prev, key) => {
    prev[clean(key)] = clean(manifest[key]);
    return prev;
  }, {});

  t.snapshot(manifest);
});
