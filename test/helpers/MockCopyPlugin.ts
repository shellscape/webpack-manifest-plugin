/* eslint-disable class-methods-use-this */
import webpack from 'webpack';
import { RawSource } from 'webpack-sources';

class MockCopyPlugin {
  apply(compiler: webpack.Compiler) {
    const hookOptions = {
      name: 'MockCopyPlugin',
      stage: (webpack.Compilation as any).PROCESS_ASSETS_STAGE_ADDITIONS
    };
    const emit = (compilation: webpack.Compilation, callback?: () => void) => {
      const output = '// some compilation result\n';
      (compilation as any).emitAsset('third.party.js', new RawSource(output));

      callback && callback();
    };

    compiler.hooks.thisCompilation.tap(hookOptions as any, (compilation) => {
      (compilation.hooks as any).processAssets.tap(hookOptions as any, () =>
        emit(compilation as any)
      );
    });
  }
}

export { MockCopyPlugin };
