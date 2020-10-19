const { SyncWaterfallHook } = require('tapable');

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

module.exports = { getCompilerHooks };
