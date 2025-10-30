import { join } from 'node:path';

import del from 'del';

import test from '../helpers/ava-compat';
import { compile } from '../helpers/unit.js';

const outputPath = join(__dirname, '../output/generate');

test.after(() => del(outputPath));

test('generate can customize manifest output structure', async (t) => {
  const config = {
    context: __dirname,
    entry: {
      one: '../fixtures/file.js',
      two: '../fixtures/file-two.js'
    },
    output: { path: join(outputPath, 'custom-generate') }
  };
  const { manifest } = await compile(config, t, {
    generate(seed: any, files: any[]) {
      return files.reduce((m, f) => Object.assign(m, { [f.name]: f.path }), seed);
    }
  });

  t.deepEqual(manifest, {
    'one.js': 'one.js',
    'two.js': 'two.js'
  });
});

test('generate receives seed and entries', async (t) => {
  const config = {
    context: __dirname,
    entry: {
      one: '../fixtures/file.js'
    },
    output: { path: join(outputPath, 'generate-seed-entries') }
  };
  const { manifest } = await compile(config, t, {
    generate(seed: any) {
      t.deepEqual(seed, { key: 'value' });
      return seed;
    },
    seed: { key: 'value' }
  });

  t.deepEqual(manifest, {
    key: 'value'
  });
});

test('generate can output arrays', async (t) => {
  const config = {
    context: __dirname,
    entry: {
      one: '../fixtures/file.js',
      two: '../fixtures/file-two.js'
    },
    output: { path: join(outputPath, 'generate-array') }
  };
  const { manifest } = await compile(config, t, {
    generate(seed: any, files: any[]) {
      return files.map((f) => f.name);
    }
  });

  t.deepEqual(manifest, ['one.js', 'two.js']);
});

test('generate can use compilation data', async (t) => {
  const config = {
    context: __dirname,
    entry: {
      one: '../fixtures/file.js',
      two: '../fixtures/file-two.js'
    },
    output: { path: join(outputPath, 'generate-compilation') }
  };
  const { manifest } = await compile(config, t, {
    generate(seed: any, files: any[], entries: any) {
      return Object.keys(entries).reduce((m, e) => Object.assign(m, { [e]: entries[e][0] }), seed);
    }
  });

  t.deepEqual(manifest, {
    one: 'one.js',
    two: 'two.js'
  });
});
