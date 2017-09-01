var path = require('path');
var fse = require('fs-extra');
var _ = require('lodash');
var mutexify = require('mutexify');

var lock = mutexify();

function ManifestPlugin(opts) {
  this.opts = _.assign({
    basePath: '',
    fileName: 'manifest.json',
    transformExtensions: /^(gz|map)$/i,
    writeToFileEmit: false,
    seed: null,
    filter: null,
    map: null,
    generate: null,
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
  var seed = this.opts.seed || {};
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
    var publicPath = compilation.options.output.publicPath;
    var stats = compilation.getStats().toJson();

    var files = compilation.chunks.reduce(function(files, chunk) {
      return chunk.files.reduce(function (files, path) {
        var name = chunk.name ? chunk.name : null;

        if (name) {
          name = name + '.' + this.getFileType(path);
        } else {
          // For nameless chunks, just map the files directly.
          name = path;
        }

        return files.concat({
          path: path,
          chunk: chunk,
          name: name,
          isInitial: chunk.isInitial ? chunk.isInitial() : chunk.initial,
          isChunk: true,
          isAsset: false,
          isModuleAsset: false
        });
      }.bind(this), files);
    }.bind(this), []);

    // module assets don't show up in assetsByChunkName.
    // we're getting them this way;
    files = stats.assets.reduce(function (files, asset) {
      var name = moduleAssets[asset.name];
      if (name) {
        return files.concat({
          path: asset.name,
          name: name,
          isInitial: false,
          isChunk: false,
          isAsset: true,
          isModuleAsset: true
        });
      }

      var isEntryAsset = asset.chunks.length > 0;
      if (isEntryAsset) {
        return files;
      }

      return files.concat({
        path: asset.name,
        name: asset.name,
        isInitial: false,
        isChunk: false,
        isAsset: true,
        isModuleAsset: false
      });
    }, files);

    files = files.filter(function (file) {
      // Don't add hot updates to manifest
      return file.path.indexOf('hot-update') === -1;
    });

    // Append optional basepath onto all references.
    // This allows output path to be reflected in the manifest.
    if (this.opts.basePath) {
      files = files.map(function(file) {
        file.name = this.opts.basePath + file.name;
        return file;
      }.bind(this));
    }

    if (publicPath) {
      // Similar to basePath but only affects the value (similar to how
      // output.publicPath turns require('foo/bar') into '/public/foo/bar', see
      // https://github.com/webpack/docs/wiki/configuration#outputpublicpath
      files = files.map(function(file) {
        file.path = publicPath + file.path;
        return file;
      }.bind(this));
    }

    files = files.map(file => {
      file.name = file.name.replace(/\\/g, '/');
      file.path = file.path.replace(/\\/g, '/');
      return file;
    });

    if (this.opts.filter) {
      files = files.filter(this.opts.filter);
    }

    if (this.opts.map) {
      files = files.map(this.opts.map);
    }

    if (this.opts.sort) {
      files = files.sort(this.opts.sort);
    }

    var manifest;
    if (this.opts.generate) {
      manifest = this.opts.generate(seed, files);
    } else {
      manifest = files.reduce(function (manifest, file) {
        manifest[file.name] = file.path;
        return manifest;
      }, seed);
    }

    var json = JSON.stringify(manifest, null, 2);

    var outputFolder = compilation.options.output.path;
    var outputFile = path.resolve(compilation.options.output.path, this.opts.fileName);
    var outputName = path.relative(outputFolder, outputFile);

    compilation.assets[outputName] = {
      source: function() {
        return json;
      },
      size: function() {
        return json.length;
      }
    };

    if (this.opts.writeToFileEmit) {
      fse.outputFileSync(outputFile, json);
    }

    // NOTE: make sure webpack is not writing multiple manifests simultaneously
    lock(function(release) {
      compiler.plugin('after-emit', function(compilation, cb) {
        release();
        cb();
      });

      compilation.applyPluginsAsync('webpack-manifest-plugin-after-emit', manifest, compileCallback);
    });
  }.bind(this));
};

module.exports = ManifestPlugin;
