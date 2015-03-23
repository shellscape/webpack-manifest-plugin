var fs = require('fs');
var path = require('path');
var _ = require('lodash');

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

    var newManifest = Object.keys(assetsByChunkName).reduce(function(reducedObj, name){
      var chunkName = assetsByChunkName[name];

      if(Array.isArray(chunkName)) {
        var tmp = chunkName.reduce(function(prev, item){
          prev[name + '.' + this.getFileType(item)] = item;
          return prev;
        }.bind(this), {});
        return _.merge(reducedObj, tmp);
      }
      else {
        reducedObj[name + '.' + this.getFileType(chunkName)] = chunkName;
        return reducedObj;
      }
    }.bind(this), {});

    fs.writeFileSync(outputPath, JSON.stringify(newManifest, null, 2));
  }.bind(this));
};

module.exports = ManifestPlugin;
