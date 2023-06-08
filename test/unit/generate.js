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
    generate(seed) {
      t.deepEqual(seed, { key: 'value' });
      return seed;
    },
    seed: {
      key: 'value'
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
    generate(seed, files) {
      return seed.concat(
        files.map((file) => {
          return {
            file: file.path,
            name: file.name
          };
        })
      );
    },
    seed: []
  });

  t.deepEqual(manifest, [
    {
      file: 'main.js',
      name: 'main.js'
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
        entrypoints,
        files: manifestFiles
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

test('should generate manifest with chunk modules', async (t) => {
  const config = {
    context: __dirname,
    entry: '../fixtures/nameless.js',
    output: { path: join(outputPath, 'entrypoints-key') }
  };

  const { manifest } = await compile(config, t, {
    generate: (_seed, files, _entrypoints, chunkGraph) => {
      const chunkToIsEntryChunk = Object.fromEntries(
        files
          .filter((file) => file.isChunk)
          .map((file) => [file.name, chunkGraph.getNumberOfEntryModules(file.chunk) > 0])
      );
      return {
        chunkToIsEntryChunk
      };
    }
  });

  t.deepEqual(manifest, {
    chunkToIsEntryChunk: {
      'fixtures_file_js.js': false,
      'main.js': true
    }
  });
});
