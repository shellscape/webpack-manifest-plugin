const { mkdirSync, readFileSync, writeFileSync } = require('fs');
const { dirname } = require('path');

const { merge } = require('webpack-merge');
const webpack = require('webpack');

const { log } = console;

const applyDefaults = (webpackOpts) => {
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

const hashLiteral = webpack.version.startsWith('4') ? '[hash]' : '[fullhash]';

const prepare = (webpackOpts) => {
  if (Array.isArray(webpackOpts)) {
    return webpackOpts.map((opts) => applyDefaults(opts));
  }
  return applyDefaults(webpackOpts);
};

const compile = (config, compilerOps, t) => {
  const compiler = webpack(prepare(config));

  Object.assign(compiler, compilerOps);

  return new Promise((p) => {
    compiler.run((error, stats) => {
      t.falsy(error);
      if (stats.hasErrors()) {
        log(stats.toJson());
      }
      t.is(stats.hasErrors(), false);

      p(stats);
    });
  });
};

const readJson = (path) => {
  const content = readFileSync(path, 'utf-8');
  return JSON.parse(content);
};

const watch = (config, t, cb) => {
  const compiler = webpack(prepare(config));

  return compiler.watch(
    {
      aggregateTimeout: 300,
      poll: true
    },
    (err, stats) => {
      t.falsy(err);
      t.is(stats.hasErrors(), false);

      cb(stats);
    }
  );
};

const writeFile = (fileName, content) => {
  mkdirSync(dirname(fileName), { recursive: true });
  writeFileSync(fileName, content);
};

module.exports = { compile, hashLiteral, prepare, readJson, watch, writeFile };
