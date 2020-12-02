/* eslint-disable class-methods-use-this */

const webpack = require('webpack');

// eslint-disable-next-line global-require
const { RawSource } = webpack.sources || require('webpack-sources');

class MockCopyPlugin {
  apply(compiler) {
    const isVersion4 = webpack.version.startsWith('4');
    const hookOptions = {
      name: 'MockCopyPlugin',
      stage: isVersion4 ? 1000 : webpack.Compilation.PROCESS_ASSETS_STAGE_ADDITIONS
    };
    const emit = (compilation, callback) => {
      const output = '// some compilation result\n';
      compilation.emitAsset('third.party.js', new RawSource(output));

      callback && callback(); // eslint-disable-line no-unused-expressions
    };

    if (isVersion4) {
      compiler.hooks.emit.tapAsync('MockCopyPlugin', emit);
    } else {
      compiler.hooks.thisCompilation.tap(hookOptions, (compilation) => {
        compilation.hooks.processAssets.tap(hookOptions, () => emit(compilation));
      });
    }
  }
}

module.exports = { MockCopyPlugin };
