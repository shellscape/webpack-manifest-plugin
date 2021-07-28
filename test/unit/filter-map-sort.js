const { dirname, join } = require('path');

const test = require('ava');
const del = require('del');

const { compile, hashLiteral } = require('../helpers/unit');

const outputPath = join(__dirname, '../output/filter-map-sort');

test.after(() => del(outputPath));

test('filter non-initial chunks', async (t) => {
  const config = {
    context: __dirname,
    entry: {
      nameless: '../fixtures/nameless.js'
    },
    output: {
      filename: `[name].${hashLiteral}.js`,
      path: join(outputPath, 'filter-chunks')
    }
  };

  const { manifest, stats } = await compile(config, t, {
    filter(file) {
      return file.isInitial;
    }
  });

  t.is(Object.keys(manifest).length, 1);
  t.is(manifest['nameless.js'], `nameless.${stats.hash}.js`);
});

test('map file details', async (t) => {
  const config = {
    context: __dirname,
    entry: '../fixtures/file.js',
    output: {
      filename: '[name].js',
      path: join(outputPath, 'map-files')
    }
  };
  const { manifest } = await compile(config, t, {
    map(file, i) {
      file.name = i.toString();
      return file;
    }
  });

  t.deepEqual(manifest, {
    0: 'main.js'
  });
});

test('map subfolders', async (t) => {
  const config = {
    context: __dirname,
    entry: '../fixtures/file.js',
    output: {
      filename: 'javascripts/main.js',
      path: join(outputPath, 'map-subfolders')
    }
  };

  const { manifest } = await compile(config, t, {
    map(file) {
      file.name = join(dirname(file.path), file.name);
      return file;
    }
  });

  t.deepEqual(manifest, {
    'javascripts/main.js': 'javascripts/main.js'
  });
});

test('sort', async (t) => {
  const config = {
    context: __dirname,
    entry: {
      one: '../fixtures/file.js',
      two: '../fixtures/file-two.js'
    },
    output: {
      filename: '[name].js',
      path: join(outputPath, 'sort')
    }
  };
  const { manifest } = await compile(config, t, {
    generate(seed, files) {
      return files.map((file) => file.name);
    },
    seed: [],
    sort(a) {
      // make sure one is the latest
      return a.name === 'one.js' ? 1 : -1;
    }
  });

  t.deepEqual(manifest, ['two.js', 'one.js']);
});
