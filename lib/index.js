const { relative, resolve } = require('path');

const { beforeRunHook, emitHook, getCompilerHooks, moduleAssetHook } = require('./hooks');

const emitCountMap = new Map();

const defaults = {
  basePath: '',
  fileName: 'manifest.json',
  filter: null,
  generate: null,
  map: null,
  publicPath: null,
  seed: null,
  serialize(manifest) {
    return JSON.stringify(manifest, null, 2);
  },
  sort: null,
  transform: (files) => files,
  transformExtensions: /^(gz|map)$/i,
  writeToFileEmit: false
};

class WebpackManifestPlugin {
  constructor(opts) {
    this.options = Object.assign({}, defaults, opts);
  }

  apply(compiler) {
    const moduleAssets = {};
    const manifestFileName = resolve(compiler.options.output.path, this.options.fileName);
    const manifestAssetId = relative(compiler.options.output.path, manifestFileName);
    const beforeRun = beforeRunHook.bind(this, { emitCountMap, manifestFileName });
    const emit = emitHook.bind(this, {
      compiler,
      emitCountMap,
      manifestAssetId,
      manifestFileName,
      moduleAssets,
      options: this.options
    });
    const moduleAsset = moduleAssetHook.bind(this, { moduleAssets });
    const hookOptions = {
      name: 'WebpackManifestPlugin',
      stage: Infinity
    };

    compiler.hooks.compilation.tap(hookOptions, (compilation) => {
      compilation.hooks.moduleAsset.tap(hookOptions, moduleAsset);
    });
    compiler.hooks.emit.tap(hookOptions, emit);
    compiler.hooks.run.tap(hookOptions, beforeRun);
    compiler.hooks.watchRun.tap(hookOptions, beforeRun);
  }
}

module.exports = { getCompilerHooks, WebpackManifestPlugin };
