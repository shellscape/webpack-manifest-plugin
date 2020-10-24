const { mkdirSync, writeFileSync } = require('fs');
const { basename, dirname, join } = require('path');

const { SyncWaterfallHook } = require('tapable');

const { reduceAssets, reduceChunk, transformFiles } = require('./helpers');

const compilerHookMap = new WeakMap();

const getCompilerHooks = (compiler) => {
  let hooks = compilerHookMap.get(compiler);
  if (typeof hooks === 'undefined') {
    hooks = {
      afterEmit: new SyncWaterfallHook(['manifest'])
    };
    compilerHookMap.set(compiler, hooks);
  }
  return hooks;
};

const beforeRunHook = ({ emitCountMap, manifestFileName }, compiler, callback) => {
  const emitCount = emitCountMap.get(manifestFileName) || 0;
  emitCountMap.set(manifestFileName, emitCount + 1);

  if (callback) {
    callback();
  }
};

const emitHook = function emit(
  { compiler, emitCountMap, manifestAssetId, manifestFileName, moduleAssets, options },
  compilation
) {
  const emitCount = emitCountMap.get(manifestFileName) - 1;
  emitCountMap.set(manifestFileName, emitCount);

  const seed = options.seed || {};
  const publicPath =
    options.publicPath !== null ? options.publicPath : compilation.options.output.publicPath;
  const stats = compilation.getStats().toJson({
    // Disable data generation of everything we don't use
    all: false,
    // Add asset Information
    assets: true,
    // Show cached assets (setting this to `false` only shows emitted files)
    cachedAssets: true
  });

  let files = compilation.chunks.reduce((prev, chunk) => reduceChunk(prev, chunk, options), []);

  // module assets don't show up in assetsByChunkName, we're getting them this way
  files = stats.assets.reduce((prev, asset) => reduceAssets(prev, asset, moduleAssets), files);

  files = files.filter((file) => {
    // Don't add hot updates to manifest
    const isUpdateChunk = file.path.indexOf('hot-update') >= 0;
    // Don't add manifest from another instance
    const isManifest =
      typeof emitCountMap.get(join(compiler.options.output.path, file.name)) !== 'undefined';

    return !isUpdateChunk && !isManifest;
  });

  // Append optional basepath onto all references.
  // This allows output path to be reflected in the manifest.
  if (options.basePath) {
    files = files.map((file) => {
      file.name = options.basePath + file.name;
      return file;
    });
  }

  if (publicPath) {
    // Similar to basePath but only affects the value (similar to how
    // output.publicPath turns require('foo/bar') into '/public/foo/bar', see
    // https://github.com/webpack/docs/wiki/configuration#outputpublicpath
    files = files.map((file) => {
      file.path = publicPath + file.path;
      return file;
    });
  }

  files = transformFiles(files, options);

  let manifest;
  if (options.generate) {
    const entrypointsArray = Array.from(compilation.entrypoints.entries());
    const entrypoints = entrypointsArray.reduce(
      (e, [name, entrypoint]) => Object.assign(e, { [name]: entrypoint.getFiles() }),
      {}
    );
    manifest = options.generate(seed, files, entrypoints);
  } else {
    manifest = files.reduce((manifest, file) => {
      manifest[file.name] = file.path;
      return manifest;
    }, seed);
  }

  const isLastEmit = emitCount === 0;
  if (isLastEmit) {
    const output = options.serialize(manifest);

    compilation.assets[manifestAssetId] = {
      source() {
        return output;
      },
      size() {
        return output.length;
      }
    };

    if (options.writeToFileEmit) {
      mkdirSync(dirname(manifestFileName), { recursive: true });
      writeFileSync(manifestFileName, output);
    }
  }

  getCompilerHooks(compiler).afterEmit.call(manifest);
};

const moduleAssetHook = ({ moduleAssets }, module, file) => {
  if (module.userRequest) {
    moduleAssets[file] = join(dirname(file), basename(module.userRequest));
  }
};

module.exports = { beforeRunHook, emitHook, getCompilerHooks, moduleAssetHook };
