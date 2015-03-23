var fs = require('fs');
var path = require('path');
var _ = require('lodash');

function ManifestPlugin() {
  this.opts = {
    fileName: 'manifest.json',
    imageExtenstions: /(jpe?g|png|gif|svg)$/i
  };
};

ManifestPlugin.prototype.getFileType = function(str) {
  return str.split('.').pop();
};

ManifestPlugin.prototype.apply = function(compiler) {
  var outputName = this.opts.fileName;
  var outputPath = path.join(compiler.options.output.path, outputName);

  compiler.plugin('done', function(stats){
    var stats = stats.toJson();
    var assetsByChunkName = stats.assetsByChunkName;

    var manifest = {};

    _.merge(manifest, Object.keys(assetsByChunkName).reduce(function(reducedObj, name){
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
    }.bind(this), {}));

    // images don't show up in assetsByChunkName.
    // we're getting them this way;
    _.merge(manifest, stats.assets.reduce(function(prevObj, asset){
      var ext = this.getFileType(asset.name);

      if (this.opts.imageExtenstions.test(ext)) {
        var trimmedName = asset.name.split('.').shift();
        prevObj[trimmedName + '.' + ext] = asset.name;
      }

      return prevObj;
    }.bind(this), {}))

    fs.writeFileSync(outputPath, JSON.stringify(manifest, null, 2));
  }.bind(this));
};

module.exports = ManifestPlugin;
