const { join } = require('path');

const test = require('ava');
const webpack = require('webpack');

const { WebpackManifestPlugin } = require('../../lib');
const { hashLiteral, readJson, watch, writeFile } = require('../helpers/integration');

const outputPath = join(__dirname, '../output/watch-mode');

let compiler;
let hashes;

test.before(() => {
  writeFile(join(outputPath, 'index.js'), "console.log('v1')");
  hashes = [];
});

test.after.cb((t) => {
  compiler.close(t.end);
});

test.cb('outputs a manifest of one file', (t) => {
  const config = {
    context: __dirname,
    output: {
      filename: `[name].${hashLiteral}.js`,
      path: outputPath
    },
    entry: '../output/watch-mode/index.js',
    watch: true,
    plugins: [new WebpackManifestPlugin(), new webpack.HotModuleReplacementPlugin()]
  };

  compiler = watch(config, t, (stats) => {
    const manifest = readJson(join(outputPath, 'manifest.json'));

    t.truthy(manifest);
    t.deepEqual(manifest, { 'main.js': `main.${stats.hash}.js` });

    hashes.push(stats.hash);

    if (hashes.length === 2) {
      t.notDeepEqual(hashes[0], hashes[1]);
      t.end();
    }

    writeFile(join(outputPath, 'index.js'), "console.log('v2')");
  });
});
