const { join } = require('path');

const test = require('ava');
const del = require('del');

const { WebpackManifestPlugin } = require('../../lib');
const { compile, readJson } = require('../helpers/integration');

const absOutputPath = join(__dirname, '../output/absolute-manifest');
const outputPath = join(__dirname, '../output/relative-manifest');

test.beforeEach(async () => {
  await del(outputPath);
  await del(absOutputPath);
});

test('output to the correct location', async (t) => {
  const config = {
    context: __dirname,
    entry: '../fixtures/file.js',
    output: {
      filename: '[name].js',
      path: outputPath
    },
    plugins: [new WebpackManifestPlugin({ fileName: 'webpack.manifest.json' })]
  };

  await compile(config, {}, t);

  const manifestPath = join(outputPath, 'webpack.manifest.json');
  const result = readJson(manifestPath);

  t.deepEqual(result, { 'main.js': 'main.js' });
});

test('output using absolute path', async (t) => {
  const config = {
    context: __dirname,
    entry: '../fixtures/file.js',
    output: {
      filename: '[name].js',
      path: absOutputPath
    },
    plugins: [new WebpackManifestPlugin({ fileName: join(absOutputPath, 'webpack.manifest.json') })]
  };
  await compile(config, {}, t);

  const manifestPath = join(absOutputPath, 'webpack.manifest.json');
  const result = readJson(manifestPath);

  t.deepEqual(result, { 'main.js': 'main.js' });
});
