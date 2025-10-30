import { join } from 'node:path';

import { deleteSync as del } from 'del';

import test from '../helpers/ava-compat';
import { WebpackManifestPlugin } from '../../src/index.js';
import { compile, readJson } from '../helpers/integration.js';

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
  } as any;

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
  } as any;
  await compile(config, {}, t);

  const manifestPath = join(absOutputPath, 'webpack.manifest.json');
  const result = readJson(manifestPath);

  t.deepEqual(result, { 'main.js': 'main.js' });
});
