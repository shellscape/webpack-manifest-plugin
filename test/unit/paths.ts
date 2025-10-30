import { join } from 'node:path';

import del from 'del';

import test from '../helpers/ava-compat';
import { compile, hashLiteral } from '../helpers/unit.js';

const outputPath = join(__dirname, '../output/paths');

test.after(() => del(outputPath));

test('does not prefix seed attributes with basePath', async (t) => {
  const config = {
    context: __dirname,
    entry: {
      one: '../fixtures/file.js'
    },
    output: {
      filename: `[name].${hashLiteral}.js`,
      path: join(outputPath, 'seed-no-prefix'),
      publicPath: '/app/'
    }
  } as any;
  const { manifest, stats } = await compile(config, t, {
    basePath: '/app/',
    seed: {
      test1: 'test2'
    }
  });

  t.deepEqual(manifest, {
    '/app/one.js': `/app/one.${(stats as any).hash}.js`,
    test1: 'test2'
  });
});

test('prefixes definitions with a base path', async (t) => {
  const config = {
    context: __dirname,
    entry: {
      one: '../fixtures/file.js'
    },
    output: {
      filename: `[name].${hashLiteral}.js`,
      path: join(outputPath, 'definition-prefix')
    }
  } as any;
  const { manifest, stats } = await compile(config, t, {
    basePath: '/app/'
  });

  t.deepEqual(manifest, {
    '/app/one.js': `one.${(stats as any).hash}.js`
  });
});

test('prefixes paths with a public path', async (t) => {
  const config = {
    context: __dirname,
    entry: {
      one: '../fixtures/file.js'
    },
    output: {
      filename: `[name].${hashLiteral}.js`,
      path: join(outputPath, 'public-prefix'),
      publicPath: '/app/'
    }
  } as any;
  const { manifest, stats } = await compile(config, t);
  t.deepEqual(manifest, {
    'one.js': `/app/one.${(stats as any).hash}.js`
  });
});

test(`prefixes paths with a public path and handle ${hashLiteral} from public path`, async (t) => {
  const config = {
    context: __dirname,
    entry: {
      one: '../fixtures/file.js'
    },
    output: {
      filename: '[name].js',
      path: join(outputPath, 'public-hash'),
      publicPath: `/${hashLiteral}/app/`
    }
  } as any;
  const { manifest, stats } = await compile(config, t);

  t.deepEqual(manifest, {
    'one.js': `/${(stats as any).hash}/app/one.js`
  });
});

test('is possible to override publicPath', async (t) => {
  const config = {
    context: __dirname,
    entry: {
      one: '../fixtures/file.js'
    },
    output: {
      filename: `[name].${hashLiteral}.js`,
      path: join(outputPath, 'public-override'),
      publicPath: '/app/'
    }
  } as any;
  const { manifest, stats } = await compile(config, t, {
    publicPath: ''
  });

  t.deepEqual(manifest, {
    'one.js': `one.${(stats as any).hash}.js`
  });
});

test('prefixes definitions with a base path when public path is also provided', async (t) => {
  const config = {
    context: __dirname,
    entry: {
      one: '../fixtures/file.js'
    },
    output: {
      filename: `[name].${hashLiteral}.js`,
      path: join(outputPath, 'prefix-base'),
      publicPath: '/app/'
    }
  } as any;
  const { manifest, stats } = await compile(config, t, {
    basePath: '/app/'
  });

  t.deepEqual(manifest, {
    '/app/one.js': `/app/one.${(stats as any).hash}.js`
  });
});

test('should keep full urls provided by basePath', async (t) => {
  const config = {
    context: __dirname,
    entry: {
      one: '../fixtures/file.js'
    },
    output: {
      filename: '[name].js',
      path: join(outputPath, 'base-urls')
    }
  } as any;
  const { manifest } = await compile(config, t, {
    basePath: 'https://www/example.com/'
  });

  t.deepEqual(manifest, {
    'https://www/example.com/one.js': 'one.js'
  });
});

test('should keep full urls provided by publicPath', async (t) => {
  const config = {
    context: __dirname,
    entry: {
      one: '../fixtures/file.js'
    },
    output: {
      filename: '[name].js',
      path: join(outputPath, 'full-urls'),
      publicPath: 'http://www/example.com/'
    }
  } as any;
  const { manifest } = await compile(config, t);

  t.deepEqual(manifest, {
    'one.js': 'http://www/example.com/one.js'
  });
});

test('ensures the manifest is mapping paths to names', async (t) => {
  const config = {
    context: __dirname,
    entry: '../fixtures/file.txt',
    module: {
      rules: [
        {
          test: /(\.(txt))/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: 'outputfile.[ext]'
              }
            }
          ]
        }
      ]
    },
    output: { path: join(outputPath, 'map-path-name') }
  } as any;
  const { manifest } = await compile(config, t);
  const expected = {
    'file.txt': 'outputfile.txt',
    'main.js': 'main.js'
  } as const;

  t.truthy(manifest);
  t.deepEqual(manifest, expected);
});

test('should output unix paths', async (t) => {
  const config = {
    context: __dirname,
    entry: {
      'dir\\main': '../fixtures/file.js',
      'some\\dir\\main': '../fixtures/file.js'
    },
    output: { path: join(outputPath, 'unix') }
  } as any;
  const { manifest } = await compile(config, t);

  t.truthy(manifest);
  t.deepEqual(manifest, {
    'dir/main.js': 'dir/main.js',
    'some/dir/main.js': 'some/dir/main.js'
  });
});
