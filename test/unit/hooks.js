/* eslint-disable class-methods-use-this */

const { join } = require('path');

const test = require('ava');
const del = require('del');

const { getCompilerHooks } = require('../..');

const { compile } = require('../helpers/unit');

const outputPath = join(__dirname, '../output/hooks');

test.after(() => del(outputPath));

test('afterEmit, beforeEmit', async (t) => {
  let flag = false;
  class HookPlugin {
    apply(compiler) {
      const { afterEmit, beforeEmit } = getCompilerHooks(compiler);

      afterEmit.tap('HookPlugin', () => {
        flag = true;
      });

      beforeEmit.tap('HookPlugin', (manifest) => {
        return { ...manifest, bruce: 'wayne' };
      });
    }
  }

  const config = {
    context: __dirname,
    entry: '../fixtures/file.js',
    output: { path: outputPath },
    plugins: [new HookPlugin()]
  };
  const { manifest } = await compile(config, t);

  t.is(flag, true);
  t.snapshot(manifest);
});
