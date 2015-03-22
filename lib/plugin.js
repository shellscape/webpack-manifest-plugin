var fs = require('fs');
var path = require('path');

function ManifestPlugin() {
  this.opts = {
    fileName: 'manifest.json'
  };
};

ManifestPlugin.prototype.getFileType = function(str) {
  return str.split('.').pop();
};

ManifestPlugin.prototype.apply = function(compiler) {
  var outputName = this.opts.fileName;
  var outputPath = path.join(compiler.options.output.path, outputName);

  compiler.plugin('done', function(stats){
    var assetsByChunkName = stats.toJson().assetsByChunkName;

    var newManifest = Object.keys(assetsByChunkName).reduce(function(obj, name){
      var chunkName = assetsByChunkName[name];

      obj[name + '.' + this.getFileType(chunkName)] = chunkName;
      return obj;
    }.bind(this), {});

    fs.writeFileSync(outputPath, JSON.stringify(newManifest, null, 2));
  }.bind(this));
};

module.exports = ManifestPlugin;
