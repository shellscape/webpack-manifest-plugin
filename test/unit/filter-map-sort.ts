import { join } from 'node:path';

import del from 'del';

import test from '../helpers/ava-compat';
import { compile, hashLiteral } from '../helpers/unit.js';

const outputPath = join(__dirname, '../output/filter-map-sort');

test.after(() => del(outputPath));

test.skip('filter removes files from manifest', async (t) => {
  const config = {
    context: __dirname,
    entry: {
      nameless: '../fixtures/nameless.js',
      one: '../fixtures/file.js'
    },
    output: {
      filename: `[name].${hashLiteral}.js`,
      path: join(outputPath, 'filter')
    }
  };
  const { manifest, stats } = await compile(config, t, {
    filter: ({ isChunk, isInitial }: any) => isInitial && isChunk
  });

  t.is(Object.keys(manifest).length, 1);
  t.is(manifest['nameless.js'], `nameless.${(stats as any).hash}.js`);
});

test('map can modify files before generating manifest', async (t) => {
  const config = {
    context: __dirname,
    entry: {
      one: '../fixtures/file.js',
      two: '../fixtures/file-two.js'
    },
    output: { path: join(outputPath, 'map') }
  };
  const { manifest } = await compile(config, t, {
    map: (file: any) => {
      return { ...file, name: `renamed/${file.name}` };
    }
  });

  t.deepEqual(manifest, {
    'renamed/one.js': 'one.js',
    'renamed/two.js': 'two.js'
  });
});

test('sort can reorder files', async (t) => {
  const config = {
    context: __dirname,
    entry: {
      one: '../fixtures/file.js',
      two: '../fixtures/file-two.js'
    },
    output: { path: join(outputPath, 'sort') }
  };
  const { manifest } = await compile(config, t, {
    sort: (a: any, b: any) => (a.name > b.name ? -1 : 1)
  });

  t.deepEqual(Object.keys(manifest), ['two.js', 'one.js']);
});
