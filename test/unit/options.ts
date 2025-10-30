/* eslint-disable class-methods-use-this */
import { join } from 'node:path';

import CopyPlugin from 'copy-webpack-plugin';
import DependencyExtractionWebpackPlugin from '@wordpress/dependency-extraction-webpack-plugin';
import { deleteSync as del } from 'del';

import test from '../helpers/ava-compat';
import { compile } from '../helpers/unit.js';

const outputPath = join(__dirname, '../output/options');

test.after(() => del(outputPath));

const clean = (what: string) => what.replace(/([a-f0-9]{16,32})/gi, '[test-hash]');

test('removeKeyHash', async (t) => {
  const config = {
    context: __dirname,
    entry: '../fixtures/file.js',
    output: {
      filename: '[contenthash].removeKeyHash.js',
      path: join(outputPath, 'removeKeyHash')
    },
    plugins: [
      new (CopyPlugin as any)({
        patterns: [
          { from: '../fixtures/*.css', to: '[name].[contenthash][ext]' },
          { from: '../fixtures/*.txt', to: '[contenthash].[name][ext]' }
        ]
      })
    ]
  } as any;

  let { manifest } = await compile(config, t);

  manifest = Object.keys(manifest).reduce((prev: any, key: string) => {
    prev[clean(key)] = clean(manifest[key]);
    return prev;
  }, {} as any);

  t.snapshot(manifest);

  ({ manifest } = await compile(config, t, { removeKeyHash: false }));

  manifest = Object.keys(manifest).reduce((prev: any, key: string) => {
    prev[clean(key)] = clean(manifest[key]);
    return prev;
  }, {} as any);

  t.snapshot(manifest);
});

test('removeKeyHash, custom hash length', async (t) => {
  const config = {
    context: __dirname,
    entry: '../fixtures/file.js',
    output: {
      filename: '[contenthash].removeKeyHash.js',
      hashDigestLength: 16,
      path: join(outputPath, 'removeKeyHashCustomLength')
    },
    plugins: [
      new (CopyPlugin as any)({
        patterns: [
          { from: '../fixtures/*.css', to: '[name].[contenthash][ext]' },
          { from: '../fixtures/*.txt', to: '[contenthash].[name][ext]' }
        ]
      })
    ]
  } as any;

  let { manifest } = await compile(config, t);

  manifest = Object.keys(manifest).reduce((prev: any, key: string) => {
    prev[clean(key)] = clean(manifest[key]);
    return prev;
  }, {} as any);

  t.snapshot(manifest);

  ({ manifest } = await compile(config, t, { removeKeyHash: false }));

  manifest = Object.keys(manifest).reduce((prev: any, key: string) => {
    prev[clean(key)] = clean(manifest[key]);
    return prev;
  }, {} as any);

  t.snapshot(manifest);
});

test('useEntryKeys', async (t) => {
  const config = {
    context: __dirname,
    entry: {
      main: '../fixtures/file.js'
    },
    output: {
      filename: '[name].js',
      path: join(outputPath, 'useEntryKeys')
    }
  } as any;
  const { manifest } = await compile(config, t, { useEntryKeys: true });

  t.snapshot(manifest);
});

test('useEntryKeys, exclude sourcemap', async (t) => {
  const config = {
    context: __dirname,
    devtool: 'source-map',
    entry: {
      main: '../fixtures/file.js'
    },
    output: {
      filename: '[name].js',
      path: join(outputPath, 'useEntryKeys-exclude')
    }
  } as any;
  const { manifest } = await compile(config, t, { useEntryKeys: true });

  t.snapshot(manifest);
});

test('useLegacyEmit', async (t) => {
  const config = {
    context: __dirname,
    entry: {
      main: '../fixtures/file.js'
    },
    output: {
      filename: '[name].js',
      path: join(outputPath, 'useLegacyEmit')
    },
    plugins: [
      new (DependencyExtractionWebpackPlugin as any)({
        outputFormat: 'json'
      })
    ]
  } as any;
  const { manifest } = await compile(config, t, { useLegacyEmit: true });

  t.snapshot(manifest);
});

test('assetHookStage', async (t) => {
  const FIRST_PROCESS_ASSETS_STAGE = 0;
  const SECOND_PROCESS_ASSETS_STAGE = 1;
  let assets: string[] = [];

  class LastStagePlugin {
    apply(compiler: any) {
      const callback = (compilation: any) => {
        // We'll check for our manifest being included in the assets of this invocation
        assets = Object.keys(compilation);
      };

      const hookOptions = {
        name: 'LastStagePlugin',
        // Make sure our plugin is scheduled to run after the manifest plugin
        stage: SECOND_PROCESS_ASSETS_STAGE
      };

      compiler.hooks.thisCompilation.tap(hookOptions, (compilation: any) => {
        compilation.hooks.processAssets.tap(hookOptions, callback);
      });
    }
  }

  const config = {
    context: __dirname,
    entry: {
      main: '../fixtures/file.js'
    },
    output: {
      filename: '[name].js',
      path: join(outputPath, 'assetHookStage')
    },
    plugins: [new LastStagePlugin()]
  } as any;

  // Ensure we register the manifest plugin to run first.
  const { manifest } = await compile(config, t, { assetHookStage: FIRST_PROCESS_ASSETS_STAGE });

  t.snapshot(manifest);
  const laterPluginHasManifest = (assets as any).includes('manifest.json');
  t.is(laterPluginHasManifest, true);
});
