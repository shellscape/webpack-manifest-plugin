const { join } = require('path');

const test = require('ava');
const del = require('del');

const MemoryFileSystem = require('memory-fs');

const { WebpackManifestPlugin } = require('../../lib');
const { compile, readJson } = require('../helpers/integration');

const outputPath = join(__dirname, '../output/emit');

test.beforeEach(() => del(outputPath));

test('outputs a manifest when using memory fs', async (t) => {
  const config = {
    context: __dirname,
    output: {
      filename: '[name].js',
      path: outputPath
    },
    entry: '../fixtures/file.js',
    plugins: [new WebpackManifestPlugin({ writeToFileEmit: true })]
  };
  await compile(config, { outputFileSystem: new MemoryFileSystem() }, t);

  const manifest = readJson(join(outputPath, 'manifest.json'));

  t.truthy(manifest);
  t.deepEqual(manifest, { 'main.js': 'main.js' });
});
