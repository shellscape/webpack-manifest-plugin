const { join } = require('path');

const test = require('ava');
const del = require('del');
const webpack = require('webpack');

const { getCompilerHooks, WebpackManifestPlugin } = require('../../');
const { compile, hashLiteral } = require('../helpers/unit');

const outputPath = join(__dirname, '../output/unit');

test.after(() => del(outputPath));

test('exports', async (t) => {
  t.truthy(getCompilerHooks);
  t.truthy(WebpackManifestPlugin);

  const compiler = {};
  const hooks = getCompilerHooks(compiler);
  t.snapshot(Object.keys(hooks));
  t.is(hooks, getCompilerHooks(compiler));
});

test('outputs a manifest of one file', async (t) => {
  const config = {
    context: __dirname,
    entry: '../fixtures/file.js',
    output: { path: join(outputPath, 'one-file') }
  };
  const { manifest } = await compile(config, t);

  t.truthy(manifest);
  t.deepEqual(manifest, { 'main.js': 'main.js' });
});

test('outputs a manifest of multiple files', async (t) => {
  const config = {
    context: __dirname,
    entry: {
      one: '../fixtures/file.js',
      two: '../fixtures/file-two.js'
    },
    output: { path: join(outputPath, 'multiple-files') }
  };
  const { manifest } = await compile(config, t);

  t.truthy(manifest);
  t.deepEqual(manifest, {
    'one.js': 'one.js',
    'two.js': 'two.js'
  });
});

test('works with hashes in the filename', async (t) => {
  const config = {
    context: __dirname,
    entry: {
      one: '../fixtures/file.js'
    },
    output: {
      filename: `[name].${hashLiteral}.js`,
      path: join(outputPath, 'hashes')
    }
  };
  const { manifest, stats } = await compile(config, t);

  t.deepEqual(manifest, { 'one.js': `one.${stats.hash}.js` });
});

test('works with source maps', async (t) => {
  const config = {
    context: __dirname,
    devtool: 'source-map',
    entry: {
      one: '../fixtures/file.js'
    },
    output: {
      filename: 'build/[name].js',
      path: join(outputPath, 'source-maps')
    }
  };
  const { manifest } = await compile(config, t);

  t.deepEqual(manifest, {
    'one.js': 'build/one.js',
    'one.js.map': 'build/one.js.map'
  });
});

test('adds seed object custom attributes when provided', async (t) => {
  const config = {
    context: __dirname,
    entry: {
      one: '../fixtures/file.js'
    },
    output: {
      filename: '[name].js',
      path: join(outputPath, 'custom-attributes')
    }
  };
  const { manifest } = await compile(config, t, { seed: { test1: 'test2' } });

  t.deepEqual(manifest, {
    'one.js': 'one.js',
    test1: 'test2'
  });
});

test('combines manifests of multiple compilations', async (t) => {
  const config = [
    {
      context: __dirname,
      entry: {
        one: '../fixtures/file.js'
      },
      output: { path: join(outputPath, 'multiple-compilations') }
    },
    {
      context: __dirname,
      entry: {
        two: '../fixtures/file-two.js'
      },
      output: { path: join(outputPath, 'multiple-compilations') }
    }
  ];
  const { manifest } = await compile(config, t, { seed: {} });

  t.deepEqual(manifest, {
    'one.js': 'one.js',
    'two.js': 'two.js'
  });
});

test('outputs a manifest of no-js file', async (t) => {
  const config = {
    context: __dirname,
    entry: '../fixtures/file.txt',
    module: {
      rules: [
        {
          test: /\.(txt)/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[name].[ext]'
              }
            }
          ]
        }
      ]
    },
    output: { path: join(outputPath, 'no-js') }
  };
  const { manifest } = await compile(config, t);
  const expected = {
    'main.js': 'main.js',
    // eslint-disable-next-line sort-keys
    'file.txt': 'file.txt'
  };

  t.truthy(manifest);
  t.deepEqual(manifest, expected);
});

test('make manifest available to other webpack plugins', async (t) => {
  const config = {
    context: __dirname,
    entry: '../fixtures/file.js',
    output: { path: join(outputPath, 'other-plugins') }
  };
  const { manifest, stats } = await compile(config, t);

  t.deepEqual(manifest, { 'main.js': 'main.js' });

  const asset = stats.compilation.assets['manifest.json'];

  try {
    t.deepEqual(JSON.parse(asset.source()), {
      'main.js': 'main.js'
    });
  } catch (e) {
    // webpack v5: Content and Map of this Source is not available (only size() is supported)
    t.pass();
  }
});

if (!webpack.version.startsWith('4')) {
  test('works with asset modules', async (t) => {
    const config = {
      context: __dirname,
      entry: '../fixtures/import_image.js',
      module: {
        rules: [
          {
            test: /\.(svg)/,
            type: 'asset/resource'
          }
        ]
      },
      output: {
        assetModuleFilename: `images/[name].[hash:4][ext]`,
        path: join(outputPath, 'auxiliary-assets')
      }
    };

    const { manifest } = await compile(config, t);
    const expected = {
      'main.js': 'main.js',
      // eslint-disable-next-line sort-keys
      'images/manifest.svg': `images/manifest.14ca.svg`
    };

    t.truthy(manifest);
    t.deepEqual(Object.keys(expected), ['main.js', 'images/manifest.svg']);
    t.deepEqual(manifest['main.js'], 'main.js');
    t.regex(manifest['images/manifest.svg'], /images\/manifest\.[a-z|\d]{4}\.svg/);
  });
} else {
  test.skip('works with asset modules', () => {});
}
