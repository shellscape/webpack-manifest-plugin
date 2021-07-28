const { join } = require('path');

const test = require('ava');
const del = require('del');

const { WebpackManifestPlugin } = require('../../');
const { compile, hashLiteral } = require('../helpers/unit');
const { MockCopyPlugin } = require('../helpers/MockCopyPlugin');

const outputPath = join(__dirname, '../output/copy-plugin');

test.after(() => del(outputPath));

test('works when including copied assets', async (t) => {
  const config = {
    context: __dirname,
    entry: {
      one: '../fixtures/file.js'
    },
    output: { path: join(outputPath, 'copied-assets') },
    plugins: [new MockCopyPlugin(), new WebpackManifestPlugin()]
  };
  const { manifest } = await compile(config, t);
  t.deepEqual(manifest, {
    'one.js': 'one.js',
    'third.party.js': 'third.party.js'
  });
});

test(`doesn't add duplicates when prefixes definitions with a base path`, async (t) => {
  const config = {
    context: __dirname,
    entry: {
      one: '../fixtures/file.js'
    },
    output: {
      filename: `[name].${hashLiteral}.js`,
      path: join(outputPath, 'prefix-duplicates'),
      publicPath: '/app/'
    },
    plugins: [
      new MockCopyPlugin(),
      new WebpackManifestPlugin({
        basePath: '/app/'
      })
    ]
  };
  const { manifest, stats } = await compile(config, t);
  t.deepEqual(manifest, {
    '/app/one.js': `/app/one.${stats.hash}.js`,
    '/app/third.party.js': '/app/third.party.js'
  });
});

test(`doesn't add duplicates when used with hashes in the filename`, async (t) => {
  const config = {
    context: __dirname,
    entry: {
      one: '../fixtures/file.js'
    },
    output: {
      filename: `[name].${hashLiteral}.js`,
      path: join(outputPath, 'hash-dupes')
    },
    plugins: [new MockCopyPlugin(), new WebpackManifestPlugin()]
  };
  const { manifest, stats } = await compile(config, t);
  t.deepEqual(manifest, {
    'one.js': `one.${stats.hash}.js`,
    'third.party.js': 'third.party.js'
  });
});

test('supports custom serializer using serialize option', async (t) => {
  const config = {
    context: __dirname,
    entry: '../fixtures/file.js',
    output: { path: join(outputPath, 'serialize') }
  };

  const { manifest } = await compile(config, t, {
    fileName: 'webpack.manifest.yml',
    serialize(man) {
      let output = '';
      // eslint-disable-next-line guard-for-in
      for (const key in man) {
        output += `- ${key}: '${man[key]}'\n`;
      }
      return output;
    }
  });

  t.snapshot(manifest);
});
