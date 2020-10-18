const { merge } = require('webpack-merge');
const webpack = require('webpack');

const { log } = console;

const applyDefaults = (webpackOpts) => {
  const defaults = {
    optimization: {
      chunkIds: 'natural'
    }
  };
  return merge(defaults, webpackOpts);
};

const prepare = (webpackOpts) => {
  if (Array.isArray(webpackOpts)) {
    return webpackOpts.map((opts) => applyDefaults(opts));
  }
  return applyDefaults(webpackOpts);
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

const compile = (config, compilerOps, t) => {
  const compiler = webpack(prepare(config));

  Object.assign(compiler, compilerOps);

  return new Promise((p) => {
    compiler.run((err, stats) => {
      t.falsy(err);
      if (stats.hasErrors()) {
        log(stats.toJson());
      }
      t.is(stats.hasErrors(), false);

      p(stats);
    });
  });
};

module.exports = { compile, watch };
