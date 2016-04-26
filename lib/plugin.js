var path = require('path');
var _ = require('lodash');

function ManifestPlugin(opts) {
  this.opts = _.assign({
    basePath: '',
    fileName: 'manifest.json',
    stripSrc: null,
    transformExtensions: /^(gz|map)$/i,
    cache: null
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
  var cache = this.opts.cache || {};
  var moduleAssets = {};

  compiler.plugin("compilation", function (compilation) {
    compilation.plugin('module-asset', function (module, file) {
      moduleAssets[file] = path.join(
          path.dirname(file),
          path.basename(module.userRequest)
      );
    });
  });

  compiler.plugin('emit', function(compilation, compileCallback) {
    var stats = compilation.getStats().toJson();
    var manifest = {};

    _.merge(cache, compilation.chunks.reduce(function(memo, chunk) {
      var chunkName = chunk.name ? chunk.name.replace(this.opts.stripSrc, '') : null;

      // Map original chunk name to output files.
      // For nameless chunks, just map the files directly.
      return chunk.files.reduce(function(memo, file) {
        if (chunkName) {
          memo[chunkName + '.' + this.getFileType(file)] = file;
        } else {
          memo[file] = file;
        }
        return memo;
      }.bind(this), memo);
    }.bind(this), {}));

    // module assets don't show up in assetsByChunkName.
    // we're getting them this way;
    _.merge(cache, stats.assets.reduce(function(memo, asset) {
      var name = moduleAssets[asset.name];
      if (name) {
        memo[name] = asset.name;
      }
      return memo;
    }, {}));

    // Append optional basepath onto all references.
    // This allows output path to be reflected in the manifest.
    if (this.opts.basePath) {
      cache = _.reduce(cache, function(memo, value, key) {
        memo[this.opts.basePath + key] = this.opts.basePath + value;
        return memo;
      }.bind(this), {});
    }

    Object.keys(cache).sort().forEach(function(key) {
      manifest[key] = cache[key];
    });

    var json = JSON.stringify(manifest, null, 2);

    compilation.assets[outputName] = {
      source: function() {
        return json;
      },
      size: function() {
        return json.length;
      }
    };

    compileCallback();

  }.bind(this));
};

module.exports = ManifestPlugin;
