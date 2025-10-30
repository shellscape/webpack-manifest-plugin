import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

import { merge } from 'webpack-merge';
import webpack from 'webpack';

const { log } = console;

const applyDefaults = (webpackOpts: any) => {
  const defaults = {
    optimization: {
      chunkIds: 'natural'
    },
    output: {
      publicPath: ''
    }
  };
  return merge(defaults, webpackOpts);
};

export const hashLiteral = '[fullhash]';

const prepare = (webpackOpts: any) => {
  if (Array.isArray(webpackOpts)) {
    return webpackOpts.map((opts) => applyDefaults(opts));
  }
  return applyDefaults(webpackOpts);
};

export const compile = (config: any, compilerOps: any, t: any) => {
  const compiler = webpack(prepare(config));

  Object.assign(compiler, compilerOps);

  return new Promise<webpack.Stats>((p) => {
    compiler.run((error, stats) => {
      t.falsy(error);
      if (stats!.hasErrors()) {
        log(stats!.toJson());
      }
      t.is(stats!.hasErrors(), false);

      p(stats!);
    });
  });
};

export const readJson = (path: string) => {
  const content = readFileSync(path, 'utf-8');
  return JSON.parse(content);
};

export const watch = (config: any, t: any, cb: (stats: webpack.Stats) => void) => {
  const compiler = webpack(prepare(config));

  return compiler.watch(
    {
      aggregateTimeout: 300,
      poll: true
    },
    (err, stats) => {
      t.falsy(err);
      t.is(stats!.hasErrors(), false);

      cb(stats!);
    }
  );
};

export const writeFile = (fileName: string, content: string) => {
  mkdirSync(dirname(fileName), { recursive: true });
  writeFileSync(fileName, content);
};
