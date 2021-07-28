const fs = require('fs');
const { join, isAbsolute } = require('path');

const webpack = require('webpack');
const { merge } = require('webpack-merge');

const { WebpackManifestPlugin } = require('../../');

const { log } = console;

const applyDefaults = (webpackOpts, manifestOptions) => {
  const defaults = {
    optimization: { chunkIds: 'named' },
    output: {
      filename: '[name].js',
      publicPath: ''
    },
    plugins: [new WebpackManifestPlugin(manifestOptions)]
  };
  return merge(defaults, webpackOpts);
};

const hashLiteral = webpack.version.startsWith('4') ? '[hash]' : '[fullhash]';

const prepare = (webpackOpts, manifestOptions) => {
  if (Array.isArray(webpackOpts)) {
    return webpackOpts.map((opts) => applyDefaults(opts, manifestOptions));
  }
  return applyDefaults(webpackOpts, manifestOptions);
};

const flatten = (array) => (array.length > 1 ? array : array[0]);

const compile = (config, t, manifestOptions = {}) => {
  const configs = flatten([config].map((options) => prepare(options, manifestOptions)));
  const compiler = webpack(configs);

  return new Promise((p, f) => {
    compiler.run((error, stats) => {
      if (error) {
        f(error);
        return;
      }

      const outputPath = [].concat(configs)[0].output.path;
      let manifestPath = join(outputPath, manifestOptions.fileName || 'manifest.json');

      if (isAbsolute(manifestOptions.fileName || '')) {
        manifestPath = manifestOptions.fileName;
      }

      let manifest = fs.readFileSync(manifestPath).toString();

      try {
        manifest = JSON.parse(manifest);
      } catch (e) {
        // eslint-disable
      }

      if (stats.hasErrors()) {
        log('Stat Errors', stats.toJson());
      }

      t.is(stats.hasErrors(), false);

      p({ fs, manifest, stats });
    });
  });
};

module.exports = { compile, hashLiteral };
