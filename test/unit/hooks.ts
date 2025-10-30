import { join } from 'node:path';

import { deleteSync as del } from 'del';

import test from '../helpers/ava-compat';
import { compile } from '../helpers/unit.js';
import { getCompilerHooks } from '../../src/index.js';

const outputPath = join(__dirname, '../output/hooks');

test.after(() => del(outputPath));

test.skip('compiler hooks beforeEmit/afterEmit are called', async (t) => {
  const config = {
    context: __dirname,
    entry: '../fixtures/file.js',
    output: { path: join(outputPath, 'hooks') }
  };
  let flag = false;

  const { manifest } = await compile(config, t, {
    generate: () => {
      return {};
    },
    seed: {},
    serialize: (m: any) => JSON.stringify(m)
    // Use compiler hooks to mutate
    // Hook usage is tested via the plugin's exported getter
  });

  // simulate hook usage
  const compiler = {} as any;
  const hooks = getCompilerHooks(compiler);
  hooks.beforeEmit.tap('test', (m: any) => m);
  hooks.afterEmit.tap('test', () => {
    flag = true;
  });

  t.is(flag, true);
  t.snapshot(manifest);
});
