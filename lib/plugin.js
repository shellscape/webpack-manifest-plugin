var fs = require('fs');
var path = require('path');
var _ = require('lodash');

function ManifestPlugin(opts) {
  this.opts = _.assign({
    basePath: '',
    fileName: 'manifest.json',
    stripSrc: null,
    imageExtensions: /(jpe?g|png|gif|svg)$/i
  }, opts || {});
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

    _.merge(manifest, Object.keys(assetsByChunkName).reduce(function(reducedObj, srcName){
      var chunkName = assetsByChunkName[srcName];
      var srcName = srcName.replace(this.opts.stripSrc, '')

      if(Array.isArray(chunkName)) {
        var tmp = chunkName.reduce(function(prev, item){
          prev[srcName + '.' + this.getFileType(item)] = item;
          return prev;
        }.bind(this), {});
        return _.merge(reducedObj, tmp);
      }
      else {
        reducedObj[srcName + '.' + this.getFileType(chunkName)] = chunkName;
        return reducedObj;
      }
    }.bind(this), {}));

    // images don't show up in assetsByChunkName.
    // we're getting them this way;
    _.merge(manifest, stats.assets.reduce(function(prevObj, asset){
      var ext = this.getFileType(asset.name);

      if (this.opts.imageExtensions.test(ext)) {
        var trimmedName = asset.name.split('.').shift();
        prevObj[trimmedName + '.' + ext] = asset.name;
      }

      return prevObj;
    }.bind(this), {}))

    // Append optional basepath onto all references.
    // This allows output path to be reflected in the manifest.
    if (this.opts.basePath) {
      manifest = _.reduce(manifest, function(memo, value, key) {
        memo[this.opts.basePath + key] = this.opts.basePath + value;
        return memo;
      }.bind(this), {});
    }

    fs.writeFileSync(outputPath, JSON.stringify(manifest, null, 2));
  }.bind(this));
};

module.exports = ManifestPlugin;
