const { basename, dirname, join } = require('path');

const { SyncWaterfallHook } = require('tapable');

const compilerHookMap = new WeakMap();

const beforeRunHook = ({ emitCountMap, manifestFileName }, compiler, callback) => {
  const emitCount = emitCountMap.get(manifestFileName) || 0;
  emitCountMap.set(manifestFileName, emitCount + 1);

  if (callback) {
    callback();
  }
};

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

const moduleAssetHook = ({ moduleAssets }, module, file) => {
  if (module.userRequest) {
    moduleAssets[file] = join(dirname(file), basename(module.userRequest));
  }
};

module.exports = { beforeRunHook, getCompilerHooks, moduleAssetHook };
