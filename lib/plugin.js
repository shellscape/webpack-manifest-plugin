var path = require('path');
var _ = require('lodash');

function ManifestPlugin(opts) {
  this.opts = _.assign({
    basePath: '',
    fileName: 'manifest.json',
    stripSrc: null,
    transformExtensions: /^(gz|map)$/i,
    readFile: false
  }, opts || {});
}

ManifestPlugin.prototype.getFileType = function(str) {
  str = str.replace(/\?.*/, '');
  var split = str.split('.');
  var ext = split.pop();
  if (this.opts.transformExtensions.test(ext)) {
    ext = split.pop() + '.' + ext;
  }
  return ext;
};

ManifestPlugin.prototype.apply = function(compiler) {
  var outputName = this.opts.fileName;
  var moduleAssets = {};

  compiler.plugin("compilation", function (compilation) {
    compilation.plugin('module-asset', function (module, file) {
      moduleAssets[file] = path.join(
          path.dirname(file),
          path.basename(module.userRequest)
      );
    });
  });

  compiler.plugin('emit', function(compilation, compileCallback){
    var stats = compilation.getStats().toJson();
    var assetsByChunkName = stats.assetsByChunkName;
    var manifest;
    if (this.opts.readFile && fs.existsSync(outputPath)) {
      manifest = JSON.parse(fs.readFileSync(outputPath).toString());
    }
    else {
      manifest = {};
    }

    _.merge(manifest, Object.keys(assetsByChunkName).reduce(function(reducedObj, srcName){
      var chunkName = assetsByChunkName[srcName];
      srcName = srcName.replace(this.opts.stripSrc, '');

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

    // module assets don't show up in assetsByChunkName.
    // we're getting them this way;
    _.merge(manifest, stats.assets.reduce(function(memo, asset){
      var name = moduleAssets[asset.name];
      if (name) {
        memo[name] = asset.name;
      }
      return memo;
    }, {}));

    // Append optional basepath onto all references.
    // This allows output path to be reflected in the manifest.
    if (this.opts.basePath) {
      manifest = _.reduce(manifest, function(memo, value, key) {
        memo[this.opts.basePath + key] = this.opts.basePath + value;
        return memo;
      }.bind(this), {});
    }

    var json = JSON.stringify(manifest, null, 2);

    compilation.assets[outputName] = {
      source: function() {
        return json;
      },
      size: function() {
        return json.length;
      }
    };

    compileCallback()

  }.bind(this));
};

module.exports = ManifestPlugin;
