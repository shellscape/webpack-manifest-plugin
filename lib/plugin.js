var fs = require('fs');
var path = require('path');

function ManifestPlugin() {
  this.opts = {
    fileName: 'manifest.json'
  }
};

ManifestPlugin.prototype.apply = function(compiler) {
  var outputName = this.opts.fileName;

  compiler.plugin('done', function(stats){
    var outputPath = path.join(this.options.output.path, outputName);
    var assetsByChunkName = stats.toJson().assetsByChunkName;

    fs.writeFileSync(outputPath, JSON.stringify(assetsByChunkName, null, 2));
  });
};

module.exports = ManifestPlugin;
