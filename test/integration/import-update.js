const { join } = require('path');

const test = require('ava');
const webpack = require('webpack');

const { WebpackManifestPlugin } = require('../../lib');
const { readJson, watch, writeFile } = require('../helpers/integration');

const outputPath = join(__dirname, '../output/watch-import-chunk');

let compiler;
let isFirstRun;

test.before(() => {
  writeFile(join(outputPath, 'chunk1.js'), "console.log('chunk 1')");
  writeFile(join(outputPath, 'chunk2.js'), "console.log('chunk 2')");
  writeFile(join(outputPath, 'index.js'), "import('./chunk1')\nimport('./chunk2')");
  isFirstRun = true;
});

test.after.cb((t) => {
  compiler.close(t.end);
});

test.cb('outputs a manifest of one file', (t) => {
  const config = {
    context: __dirname,
    output: {
      filename: '[name].js',
      path: outputPath
    },
    entry: '../output/watch-import-chunk/index.js',
    watch: true,
    plugins: [new WebpackManifestPlugin(), new webpack.HotModuleReplacementPlugin()]
  };

  compiler = watch(config, t, () => {
    const manifest = readJson(join(outputPath, 'manifest.json'));

    t.truthy(manifest);

    if (isFirstRun) {
      t.deepEqual(manifest, { 'main.js': 'main.js', '1.js': '1.js', '2.js': '2.js' });
      isFirstRun = false;
      writeFile(join(outputPath, 'index.js'), "import('./chunk1')");
    } else {
      const expected = webpack.version.startsWith('4')
        ? { 'main.js': 'main.js', '1.js': '1.js' }
        : { 'main.js': 'main.js', '2.js': '2.js' };
      t.deepEqual(manifest, expected);
      t.end();
    }
  });
});
