/* eslint-disable class-methods-use-this */

const webpack = require('webpack');

// eslint-disable-next-line global-require
const { RawSource } = webpack.sources || require('webpack-sources');

class MockCopyPlugin {
  apply(compiler) {
    const hookOptions = {
      name: 'MockCopyPlugin',
      stage: webpack.Compilation.PROCESS_ASSETS_STAGE_ADDITIONS
    };
    const emit = (compilation, callback) => {
      const output = '// some compilation result\n';
      compilation.emitAsset('third.party.js', new RawSource(output));

      callback && callback(); // eslint-disable-line no-unused-expressions
    };

    compiler.hooks.thisCompilation.tap(hookOptions, (compilation) => {
      compilation.hooks.processAssets.tap(hookOptions, () => emit(compilation));
    });
  }
}

module.exports = { MockCopyPlugin };
