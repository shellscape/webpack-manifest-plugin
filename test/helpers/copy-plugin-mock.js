function FakeCopyWebpackPlugin() {}

FakeCopyWebpackPlugin.prototype.apply = (compiler) => {
  const emit = (compilation, callback) => {
    const compiledMock = '// some compilation result\n';
    compilation.assets['third.party.js'] = {
      size() {
        return compiledMock.length;
      },
      source() {
        return compiledMock;
      }
    };

    callback();
  };

  if (compiler.hooks) {
    compiler.hooks.emit.tapAsync('FakeCopyWebpackPlugin', emit);
  } else {
    compiler.plugin('emit', emit);
  }
};

module.exports = FakeCopyWebpackPlugin;
