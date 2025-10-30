import { join } from 'node:path';

import { deleteSync as del } from 'del';

import test from '../helpers/ava-compat';
import { compile } from '../helpers/unit.js';
import { MockCopyPlugin } from '../helpers/MockCopyPlugin.js';

const outputPath = join(__dirname, '../output/copy-plugin');

test.after(() => del(outputPath));

test('includes assets from other plugins', async (t) => {
  const config = {
    context: __dirname,
    entry: '../fixtures/file.js',
    output: { path: join(outputPath, 'copy') },
    plugins: [new MockCopyPlugin()]
  } as any;
  const { manifest } = await compile(config, t);

  t.deepEqual(manifest, {
    'main.js': 'main.js',

    'third.party.js': 'third.party.js'
  });
});
