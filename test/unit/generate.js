const { join } = require('path');

const test = require('ava');
const del = require('del');

const { compile } = require('../helpers/unit');

const outputPath = join(__dirname, '../output/generate');

test.after(() => del(outputPath));

test('should generate custom manifest', async (t) => {
  const config = {
    context: __dirname,
    entry: '../fixtures/file.js',
    output: {
      filename: '[name].js',
      path: join(outputPath, 'custom')
    }
  };

  const { manifest, stats } = await compile(config, t, {
    generate(seed, files) {
      return files.reduce((man, file) => {
        man[file.name] = {
          file: file.path,
          hash: file.chunk.hash
        };
        return man;
      }, seed);
    }
  });

  t.deepEqual(manifest, {
    'main.js': {
      file: 'main.js',
      hash: Array.from(stats.compilation.chunks)[0].hash
    }
  });
});

test('should default to `seed`', async (t) => {
  const config = {
    context: __dirname,
    entry: '../fixtures/file.js',
    output: {
      filename: '[name].js',
      path: join(outputPath, 'default-seed')
    }
  };

  const { manifest } = await compile(config, t, {
    seed: {
      key: 'value'
    },
    generate(seed) {
      t.deepEqual(seed, { key: 'value' });
      return seed;
    }
  });

  t.deepEqual(manifest, {
    key: 'value'
  });
});

test('should output an array', async (t) => {
  const config = {
    context: __dirname,
    entry: '../fixtures/file.js',
    output: {
      filename: '[name].js',
      path: join(outputPath, 'array')
    }
  };

  const { manifest } = await compile(config, t, {
    seed: [],
    generate(seed, files) {
      return seed.concat(
        files.map((file) => {
          return {
            name: file.name,
            file: file.path
          };
        })
      );
    }
  });

  t.deepEqual(manifest, [
    {
      name: 'main.js',
      file: 'main.js'
    }
  ]);
});

test('should generate manifest with "entrypoints" key', async (t) => {
  const config = {
    context: __dirname,
    entry: {
      one: '../fixtures/file.js',
      two: '../fixtures/file-two.js'
    },
    output: { path: join(outputPath, 'entrypoints-key') }
  };

  const { manifest } = await compile(config, t, {
    generate: (seed, files, entrypoints) => {
      const manifestFiles = files.reduce(
        (man, { name, path }) => Object.assign(man, { [name]: path }),
        seed
      );
      return {
        files: manifestFiles,
        entrypoints
      };
    }
  });

  t.deepEqual(manifest, {
    entrypoints: {
      one: ['one.js'],
      two: ['two.js']
    },
    files: {
      'one.js': 'one.js',
      'two.js': 'two.js'
    }
  });
});
