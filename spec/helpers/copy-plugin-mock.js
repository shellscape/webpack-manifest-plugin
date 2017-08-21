function FakeCopyWebpackPlugin() {
};

/**
 * Mock plugins that modifies `compilation.assets`
 *
 * @param compiler
 */
FakeCopyWebpackPlugin.prototype.apply = function (compiler) {
  compiler.plugin('emit', function (compilation, callback) {

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
  });
};

module.exports = FakeCopyWebpackPlugin;
