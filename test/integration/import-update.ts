import { join } from 'node:path';

import webpack from 'webpack';

import test from '../helpers/ava-compat';
import { WebpackManifestPlugin } from '../../src/index.ts';
import { readJson, watch, writeFile } from '../helpers/integration.ts';

const outputPath = join(__dirname, '../output/watch-import-chunk');

let isFirstRun: boolean;

test.before(() => {
  writeFile(join(outputPath, 'chunk1.js'), "console.log('chunk 1')");
  writeFile(join(outputPath, 'chunk2.js'), "console.log('chunk 2')");
  writeFile(join(outputPath, 'index.js'), "import('./chunk1')\nimport('./chunk2')");
  isFirstRun = true;
});

test.skip('outputs a manifest of one file (watch-import)', (t) =>
  new Promise<void>((p) => {
    const config = {
      context: __dirname,
      entry: '../output/watch-import-chunk/index.js',
      output: {
        filename: '[name].js',
        path: outputPath
      },
      plugins: [new WebpackManifestPlugin(), new (webpack as any).HotModuleReplacementPlugin()],
      watch: true
    } as any;

    watch(config, t, () => {
      const manifest = readJson(join(outputPath, 'manifest.json'));

      t.truthy(manifest);

      if (isFirstRun) {
        // eslint-disable-next-line sort-keys
        t.deepEqual(manifest, { 'main.js': 'main.js', '1.js': '1.js', '2.js': '2.js' });
        isFirstRun = false;
        writeFile(join(outputPath, 'index.js'), "import('./chunk1')");
      } else {
        const expected =
          // eslint-disable-next-line sort-keys
          { 'main.js': 'main.js', '2.js': '2.js' } as const;
        t.deepEqual(manifest, expected);
        p();
      }
    });
  }));
