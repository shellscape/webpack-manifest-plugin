function FakeCopyWebpackPlugin() {
};

FakeCopyWebpackPlugin.prototype.apply = function (compiler) {
  const emit = function (compilation, callback) {

    var compiledMock = '// some compilation result\n';
    compilation.assets['third.party.js'] = {
      size: function () {
        return compiledMock.length;
      },
      source: function () {
        return compiledMock;
      }
    };

    callback();
  };

  if (compiler.hooks) {
    compiler.hooks.emit.tapAsync('FakeCopyWebpackPlugin', emit)
  } else {
    compiler.plugin('emit', emit);
  }
};

module.exports = FakeCopyWebpackPlugin;
