import { join } from 'node:path';

import test from '../helpers/ava-compat';
import { WebpackManifestPlugin } from '../../src/index.js';
import { compile, hashLiteral, readJson, writeFile } from '../helpers/integration.js';

const outputPath = join(__dirname, '../output/scoped-hoisting');

test.before(() => {
  writeFile(join(outputPath, 'index.js'), 'import { ReactComponent } from "./logo.svg";');
  writeFile(join(outputPath, 'logo.svg'), '<svg />');
});

test('outputs a manifest', async (t) => {
  const plugins = [new WebpackManifestPlugin()];

  const config = {
    context: __dirname,
    entry: '../output/scoped-hoisting/index.js',
    module: {
      rules: [
        {
          test: /\.svg$/,
          use: ['@svgr/webpack', 'file-loader']
        }
      ]
    },
    output: {
      filename: `[name].${hashLiteral}.js`,
      path: outputPath
    },
    plugins
  } as any;
  const stats: any = await compile(config, {}, t);
  const manifest = readJson(join(outputPath, 'manifest.json'));

  t.truthy(manifest);
  t.is(manifest['main.js'], `main.${stats.hash}.js`);
});
