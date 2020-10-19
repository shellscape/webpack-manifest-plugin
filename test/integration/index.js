const { join } = require('path');

const test = require('ava');
const del = require('del');
const fse = require('fs-extra');

const { compile } = require('../helpers/integration');
const { getAsset } = require('../helpers/webpack-version-helpers');
const { getCompilerHooks, WebpackManifestPlugin } = require('../../lib');

const outputPath = join(__dirname, '../output/single-file');

test.beforeEach(() => del(outputPath));

test.serial('outputs a manifest of one file', async (t) => {
  const config = {
    context: __dirname,
    output: {
      filename: '[name].js',
      path: outputPath
    },
    entry: '../fixtures/file.js',
    plugins: [new WebpackManifestPlugin()]
  };

  await compile(config, {}, t);
  const manifest = fse.readJsonSync(join(outputPath, 'manifest.json'));

  t.truthy(manifest);
  t.deepEqual(manifest, { 'main.js': 'main.js' });
});

test.serial('still works when there are multiple instances of the plugin', async (t) => {
  const config = {
    context: __dirname,
    output: {
      filename: '[name].js',
      path: outputPath
    },
    entry: '../fixtures/file.js',
    plugins: [
      new WebpackManifestPlugin({ fileName: 'manifest1.json' }),
      new WebpackManifestPlugin({ fileName: 'manifest2.json' })
    ]
  };

  const stats = await compile(config, {}, t);
  t.is(getAsset(stats.compilation, 'main.js'), true);
  t.is(getAsset(stats.compilation, 'manifest1.json'), true);
  t.is(getAsset(stats.compilation, 'manifest2.json'), true);

  const manifest1 = fse.readJsonSync(join(outputPath, 'manifest1.json'));
  t.truthy(manifest1);
  t.deepEqual(manifest1, { 'main.js': 'main.js' });

  const manifest2 = fse.readJsonSync(join(outputPath, 'manifest2.json'));
  t.truthy(manifest2);
  t.deepEqual(manifest2, { 'main.js': 'main.js' });
});

test('exposes a plugin hook with the manifest content', async (t) => {
  class TestPlugin {
    constructor() {
      this.manifest = null;
    }

    apply(compiler) {
      if (compiler.hooks) {
        const hook = getCompilerHooks(compiler).afterEmit;
        hook.tap('WebpackManifestPlugin', (manifest) => {
          this.manifest = manifest;
        });
      } else {
        compiler.plugin('compilation', (compilation) => {
          compilation.plugin('webpack-manifest-plugin-after-emit', (manifest, callback) => {
            this.manifest = manifest;
            callback();
          });
        });
      }
    }
  }

  const testPlugin = new TestPlugin();
  const config = {
    context: __dirname,
    output: {
      filename: '[name].js',
      path: outputPath
    },
    entry: '../fixtures/file.js',
    plugins: [new WebpackManifestPlugin(), testPlugin]
  };

  await compile(config, {}, t);
  t.truthy(testPlugin.manifest);
  t.deepEqual(testPlugin.manifest, { 'main.js': 'main.js' });
});
