import { join } from 'node:path';

import { deleteSync as del } from 'del';

import test from '../helpers/ava-compat';
import { WebpackManifestPlugin } from '../../src/index.js';
import { compile, readJson } from '../helpers/integration.js';

const outputPath = join(__dirname, '../output/multiple-compilation');
const outputMultiPath = join(__dirname, '../output/multiple-manifest');
const nbCompiler = 10;

test.beforeEach(async () => {
  await del(outputPath);
  await del(outputMultiPath);
});

test('should not produce mangle output', async (t) => {
  const seed: any = {};
  const config = Array.from({ length: nbCompiler }).map(
    (_, i) =>
      ({
        context: __dirname,
        entry: {
          [`main-${i}`]: '../fixtures/file.js'
        },
        output: {
          filename: '[name].js',
          path: outputPath
        },
        plugins: [new WebpackManifestPlugin({ seed })]
      } as any)
  );

  await compile(config, {}, t);

  const manifest = readJson(join(outputPath, 'manifest.json'));
  const expected = Array.from({ length: nbCompiler }).reduce((man: any, _x, i) => {
    man[`main-${i}.js`] = `main-${i}.js`;

    return man;
  }, {} as any);

  t.truthy(manifest);
  t.deepEqual(manifest, expected);
});

test('should produce two seperate manifests', async (t) => {
  const config = [
    {
      context: __dirname,
      entry: {
        main: '../fixtures/file.js'
      },
      output: {
        filename: '[name].js',
        path: join(outputMultiPath, '1')
      },
      plugins: [new WebpackManifestPlugin()]
    },
    {
      context: __dirname,
      entry: {
        main: '../fixtures/file.js'
      },
      output: {
        filename: '[name].js',
        path: join(outputMultiPath, '2')
      },
      plugins: [new WebpackManifestPlugin()]
    }
  ] as any;
  await compile(config, {}, t);

  const manifest1 = readJson(join(outputMultiPath, '1/manifest.json'));
  const manifest2 = readJson(join(outputMultiPath, '2/manifest.json'));

  t.truthy(manifest1);
  t.truthy(manifest2);
  t.deepEqual(manifest1, { 'main.js': 'main.js' });
  t.deepEqual(manifest2, { 'main.js': 'main.js' });
});
