const { mkdirSync, writeFileSync } = require('fs');
const { basename, dirname, join } = require('path');

const { SyncWaterfallHook } = require('tapable');

const { generateManifest, reduceAssets, reduceChunk, transformFiles } = require('./helpers');

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

  /* istanbul ignore next */
  if (callback) {
    callback();
  }
};

const emitHook = function emit(
  { compiler, emitCountMap, manifestAssetId, manifestFileName, moduleAssets, options },
  compilation
) {
  const emitCount = emitCountMap.get(manifestFileName) - 1;
  const publicPath =
    options.publicPath !== null ? options.publicPath : compilation.options.output.publicPath;
  // Disable everything we don't use, add asset info, show cached assets
  const stats = compilation.getStats().toJson({ all: false, assets: true, cachedAssets: true });

  emitCountMap.set(manifestFileName, emitCount);

  let files = compilation.chunks.reduce((prev, chunk) => reduceChunk(prev, chunk, options), []);

  // module assets don't show up in assetsByChunkName, we're getting them this way
  files = stats.assets.reduce((prev, asset) => reduceAssets(prev, asset, moduleAssets), files);

  // don't add hot updates and don't add manifests from other instances
  files = files.filter(
    ({ name, path }) =>
      !path.includes('hot-update') &&
      typeof emitCountMap.get(join(compiler.options.output.path, name)) === 'undefined'
  );

  // Append optional basepath onto all references. This allows output path to be reflected in the manifest.
  // TODO: Combine the two maps into one to save on perf
  if (options.basePath) {
    files = files.map((file) => Object.assign(file, { name: options.basePath + file.name }));
  }

  if (publicPath) {
    // Similar to basePath but only affects the value (e.g. how output.publicPath turns
    // require('foo/bar') into '/public/foo/bar', see https://github.com/webpack/docs/wiki/configuration#outputpublicpath
    files = files.map((file) => Object.assign(file, { path: publicPath + file.path }));
  }

  files = transformFiles(files, options);

  const manifest = generateManifest(compilation, files, options);
  const isLastEmit = emitCount === 0;

  if (isLastEmit) {
    const output = options.serialize(manifest);

    Object.assign(compilation.assets, {
      [manifestAssetId]: {
        source() {
          return output;
        },
        size() {
          return output.length;
        }
      }
    });

    if (options.writeToFileEmit) {
      mkdirSync(dirname(manifestFileName), { recursive: true });
      writeFileSync(manifestFileName, output);
    }
  }

  getCompilerHooks(compiler).afterEmit.call(manifest);
};

const moduleAssetHook = ({ moduleAssets }, module, file) => {
  if (module.userRequest) {
    Object.assign(moduleAssets, { [file]: join(dirname(file), basename(module.userRequest)) });
  }
};

module.exports = { beforeRunHook, emitHook, getCompilerHooks, moduleAssetHook };
