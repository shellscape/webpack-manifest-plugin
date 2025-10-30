import { join } from 'node:path';

import del from 'del';

import test from '../helpers/ava-compat';
import { compile, hashLiteral } from '../helpers/unit.ts';

const outputPath = join(__dirname, '../output/nameless-chunks');

test.after(() => del(outputPath));

test.skip('handles nameless chunks correctly', async (t) => {
  const config = {
    context: __dirname,
    entry: {
      nameless: '../fixtures/nameless.js'
    },
    output: {
      filename: `[name].${hashLiteral}.js`,
      path: join(outputPath, 'nameless')
    }
  };

  const { manifest, stats } = await compile(config, t);

  t.is(Object.keys(manifest).length, 2);
  t.is(manifest['nameless.js'], `nameless.${(stats as any).hash}.js`);
});
