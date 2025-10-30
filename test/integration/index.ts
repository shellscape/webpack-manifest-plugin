import { join } from 'node:path';

import { deleteSync as del } from 'del';

import test from '../helpers/ava-compat';
import { compile, readJson } from '../helpers/integration.js';
import { getAsset } from '../helpers/webpack-version-helpers.js';
import { getCompilerHooks, WebpackManifestPlugin } from '../../src/index.js';

const outputPath = join(__dirname, '../output/single-file');

test.beforeEach(() => del(outputPath));

test.serial('outputs a manifest of one file', async (t) => {
  const config = {
    context: __dirname,
    entry: '../fixtures/file.js',
    output: {
      filename: '[name].js',
      path: outputPath
    },
    plugins: [new WebpackManifestPlugin()]
  } as any;

  await compile(config, {}, t);
  const manifest = readJson(join(outputPath, 'manifest.json'));

  t.truthy(manifest);
  t.deepEqual(manifest, { 'main.js': 'main.js' });
});

test.serial('still works when there are multiple instances of the plugin', async (t) => {
  const config = {
    context: __dirname,
    entry: '../fixtures/file.js',
    output: {
      filename: '[name].js',
      path: outputPath
    },
    plugins: [
      new WebpackManifestPlugin({ fileName: 'manifest1.json' }),
      new WebpackManifestPlugin({ fileName: 'manifest2.json' })
    ]
  } as any;

  const stats: any = await compile(config, {}, t);
  t.is(getAsset(stats.compilation, 'main.js'), true);
  t.is(getAsset(stats.compilation, 'manifest1.json'), true);
  t.is(getAsset(stats.compilation, 'manifest2.json'), true);

  const manifest1 = readJson(join(outputPath, 'manifest1.json'));
  t.truthy(manifest1);
  t.deepEqual(manifest1, { 'main.js': 'main.js' });

  const manifest2 = readJson(join(outputPath, 'manifest2.json'));
  t.truthy(manifest2);
  t.deepEqual(manifest2, { 'main.js': 'main.js' });
});

test('exposes a plugin hook with the manifest content', async (t) => {
  class TestPlugin {
    manifest: any = null;
    apply(compiler: any) {
      const hook = getCompilerHooks(compiler).afterEmit;
      hook.tap('WebpackManifestPlugin', (manifest: any) => {
        this.manifest = manifest;
      });
    }
  }

  const testPlugin = new TestPlugin();
  const config = {
    context: __dirname,
    entry: '../fixtures/file.js',
    output: {
      filename: '[name].js',
      path: outputPath
    },
    plugins: [new WebpackManifestPlugin(), testPlugin]
  } as any;

  await compile(config, {}, t);
  t.truthy(testPlugin.manifest);
  t.deepEqual(testPlugin.manifest, { 'main.js': 'main.js' });
});
