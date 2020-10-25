const { join } = require('path');

const test = require('ava');
const del = require('del');

const { WebpackManifestPlugin } = require('../../lib');
const { compile, readJson } = require('../helpers/integration');

const outputPath = join(__dirname, '../output/multiple-compilation');
const outputMultiPath = join(__dirname, '../output/multiple-manifest');
const nbCompiler = 10;

test.beforeEach(async () => {
  await del(outputPath);
  await del(outputMultiPath);
});

test('should not produce mangle output', async (t) => {
  const seed = {};
  const config = Array.from({ length: nbCompiler }).map((x, i) => {
    return {
      context: __dirname,
      output: {
        filename: '[name].js',
        path: outputPath
      },
      entry: {
        [`main-${i}`]: '../fixtures/file.js'
      },
      plugins: [new WebpackManifestPlugin({ seed })]
    };
  });

  await compile(config, {}, t);

  const manifest = readJson(join(outputPath, 'manifest.json'));
  const expected = Array.from({ length: nbCompiler }).reduce((man, x, i) => {
    // eslint-disable-next-line no-param-reassign
    man[`main-${i}.js`] = `main-${i}.js`;

    return manifest;
  }, {});

  t.truthy(manifest);
  t.deepEqual(manifest, expected);
});

test('should produce two seperate manifests', async (t) => {
  const config = [
    {
      context: __dirname,
      output: {
        filename: '[name].js',
        path: join(outputMultiPath, '1')
      },
      entry: {
        main: '../fixtures/file.js'
      },
      plugins: [new WebpackManifestPlugin()]
    },
    {
      context: __dirname,
      output: {
        filename: '[name].js',
        path: join(outputMultiPath, '2')
      },
      entry: {
        main: '../fixtures/file.js'
      },
      plugins: [new WebpackManifestPlugin()]
    }
  ];
  await compile(config, {}, t);

  const manifest1 = readJson(join(outputMultiPath, '1/manifest.json'));
  const manifest2 = readJson(join(outputMultiPath, '2/manifest.json'));

  t.truthy(manifest1);
  t.truthy(manifest2);
  t.deepEqual(manifest1, { 'main.js': 'main.js' });
  t.deepEqual(manifest2, { 'main.js': 'main.js' });
});
