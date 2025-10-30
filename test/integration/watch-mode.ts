import { join } from 'node:path';

import webpack from 'webpack';

import test from '../helpers/ava-compat';
import { WebpackManifestPlugin } from '../../src/index.ts';
import { hashLiteral, readJson, watch, writeFile } from '../helpers/integration.ts';

const outputPath = join(__dirname, '../output/watch-mode');

let hashes: string[];

test.before(() => {
  writeFile(join(outputPath, 'index.js'), "console.log('v1')");
  hashes = [];
});

test.skip('outputs a manifest of one file (watch-mode)', (t) =>
  new Promise<void>((p) => {
    const config = {
      context: __dirname,
      entry: '../output/watch-mode/index.js',
      output: {
        filename: `[name].${hashLiteral}.js`,
        path: outputPath
      },
      plugins: [new WebpackManifestPlugin(), new (webpack as any).HotModuleReplacementPlugin()],
      watch: true
    } as any;

    watch(config, t, (stats: any) => {
      const manifest = readJson(join(outputPath, 'manifest.json'));

      t.truthy(manifest);
      t.deepEqual(manifest, { 'main.js': `main.${stats.hash}.js` });

      hashes.push(stats.hash);

      if (hashes.length === 2) {
        t.notDeepEqual(hashes[0], hashes[1]);
        p();
      }

      writeFile(join(outputPath, 'index.js'), "console.log('v2')");
    });
  }));
