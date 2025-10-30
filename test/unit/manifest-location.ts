import { join } from 'node:path';

import { deleteSync as del } from 'del';

import test from '../helpers/ava-compat';
import { compile } from '../helpers/unit.js';

const outputPath = join(__dirname, '../output/manifest-location');

test.after(() => del(outputPath));

test('relative path', async (t) => {
  const config = {
    context: __dirname,
    entry: '../fixtures/file.js',
    output: { path: join(outputPath, 'relative') }
  };

  const { manifest } = await compile(config, t, {
    fileName: 'webpack.manifest.json'
  });

  t.deepEqual(manifest, { 'main.js': 'main.js' });
});

test('absolute path', async (t) => {
  const config = {
    context: __dirname,
    entry: '../fixtures/file.js',
    output: { path: join(outputPath, 'absolute') }
  };

  const { manifest } = await compile(config, t, {
    fileName: join(outputPath, 'absolute/webpack.manifest.json')
  });

  t.deepEqual(manifest, { 'main.js': 'main.js' });
});
