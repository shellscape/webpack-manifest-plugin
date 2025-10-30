import { join } from 'node:path';

import del from 'del';
import MemoryFileSystem from 'memory-fs';

import test from '../helpers/ava-compat';
import { WebpackManifestPlugin } from '../../src/index.js';
import { compile, readJson } from '../helpers/integration.js';

const outputPath = join(__dirname, '../output/emit');

test.beforeEach(() => del(outputPath));

test('outputs a manifest when using memory fs', async (t) => {
  const config = {
    context: __dirname,
    entry: '../fixtures/file.js',
    output: {
      filename: '[name].js',
      path: outputPath
    },
    plugins: [new WebpackManifestPlugin({ writeToFileEmit: true })]
  } as any;
  await compile(config, { outputFileSystem: new (MemoryFileSystem as any)() }, t);

  const manifest = readJson(join(outputPath, 'manifest.json'));

  t.truthy(manifest);
  t.deepEqual(manifest, { 'main.js': 'main.js' });
});
