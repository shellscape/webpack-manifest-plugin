var fs = require('fs');
var path = require('path');

function ManifestPlugin() {
  this.opts = {
    fileName: 'manifest.json'
  }
};

ManifestPlugin.prototype.apply = function(compiler) {
  var outputName = this.opts.fileName;
  var outputPath = path.join(compiler.options.output.path, outputName);

  compiler.plugin('done', function(stats){
    var assetsByChunkName = stats.toJson().assetsByChunkName;

    fs.writeFileSync(outputPath, JSON.stringify(assetsByChunkName, null, 2));
  }.bind(this));
};

module.exports = ManifestPlugin;
