const path = require('path');

const fse = require('fs-extra');
const entries = require('object.entries');

const { getCompilerHooks } = require('./helpers');

const emitCountMap = new Map();

const standardizeFilePaths = (file) => {
  const result = Object.assign({}, file);
  result.name = file.name.replace(/\\/g, '/');
  result.path = file.path.replace(/\\/g, '/');
  return result;
};

const defaults = {
  basePath: '',
  fileName: 'manifest.json',
  filter: null,
  generate: null,
  map: null,
  publicPath: null,
  seed: null,
  serialize(manifest) {
    return JSON.stringify(manifest, null, 2);
  },
  sort: null,
  transformExtensions: /^(gz|map)$/i,
  writeToFileEmit: false
};

class WebpackManifestPlugin {
  constructor(opts) {
    this.options = Object.assign({}, defaults, opts);
  }

  getFileType(str) {
    const replaced = str.replace(/\?.*/, '');
    const split = replaced.split('.');
    let ext = split.pop();
    if (this.options.transformExtensions.test(ext)) {
      ext = `${split.pop()}.${ext}`;
    }
    return ext;
  }

  apply(compiler) {
    const moduleAssets = {};
    const outputFolder = compiler.options.output.path;
    const outputFile = path.resolve(outputFolder, this.options.fileName);
    const outputName = path.relative(outputFolder, outputFile);
    const moduleAsset = function moduleAsset(module, file) {
      if (module.userRequest) {
        moduleAssets[file] = path.join(path.dirname(file), path.basename(module.userRequest));
      }
    };

    const emit = function emit(compilation, compileCallback) {
      const emitCount = emitCountMap.get(outputFile) - 1;
      emitCountMap.set(outputFile, emitCount);

      const seed = this.options.seed || {};
      const publicPath =
        this.options.publicPath != null
          ? this.options.publicPath
          : compilation.options.output.publicPath;
      const stats = compilation.getStats().toJson({
        // Disable data generation of everything we don't use
        all: false,
        // Add asset Information
        assets: true,
        // Show cached assets (setting this to `false` only shows emitted files)
        cachedAssets: true
      });

      let files = compilation.chunks.reduce(
        (files, chunk) =>
          chunk.files.reduce((files, path) => {
            let name = chunk.name ? chunk.name : null;

            if (name) {
              name = `${name}.${this.getFileType(path)}`;
            } else {
              // For nameless chunks, just map the files directly.
              name = path;
            }

            return files.concat({
              path,
              chunk,
              name,
              isInitial: chunk.isOnlyInitial(),
              isChunk: true,
              isAsset: false,
              isModuleAsset: false
            });
          }, files),
        []
      );

      // module assets don't show up in assetsByChunkName.
      // we're getting them this way;
      files = stats.assets.reduce((files, asset) => {
        const name = moduleAssets[asset.name];
        if (name) {
          return files.concat({
            path: asset.name,
            name,
            isInitial: false,
            isChunk: false,
            isAsset: true,
            isModuleAsset: true
          });
        }

        const isEntryAsset = asset.chunks.length > 0;
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

      files = files.filter((file) => {
        // Don't add hot updates to manifest
        const isUpdateChunk = file.path.indexOf('hot-update') >= 0;
        // Don't add manifest from another instance
        const isManifest =
          typeof emitCountMap.get(path.join(outputFolder, file.name)) !== 'undefined';

        return !isUpdateChunk && !isManifest;
      });

      // Append optional basepath onto all references.
      // This allows output path to be reflected in the manifest.
      if (this.options.basePath) {
        files = files.map((file) => {
          file.name = this.options.basePath + file.name;
          return file;
        });
      }

      if (publicPath) {
        // Similar to basePath but only affects the value (similar to how
        // output.publicPath turns require('foo/bar') into '/public/foo/bar', see
        // https://github.com/webpack/docs/wiki/configuration#outputpublicpath
        files = files.map((file) => {
          file.path = publicPath + file.path;
          return file;
        });
      }

      files = files.map(standardizeFilePaths);

      if (this.options.filter) {
        files = files.filter(this.options.filter);
      }

      if (this.options.map) {
        files = files.map(this.options.map).map(standardizeFilePaths);
      }

      if (this.options.sort) {
        files = files.sort(this.options.sort);
      }

      let manifest;
      if (this.options.generate) {
        const entrypointsArray = Array.from(
          // Webpack 4+ : Webpack 3
          compilation.entrypoints instanceof Map
            ? compilation.entrypoints.entries()
            : entries(compilation.entrypoints)
        );
        const entrypoints = entrypointsArray.reduce(
          (e, [name, entrypoint]) => Object.assign(e, { [name]: entrypoint.getFiles() }),
          {}
        );
        manifest = this.options.generate(seed, files, entrypoints);
      } else {
        manifest = files.reduce((manifest, file) => {
          manifest[file.name] = file.path;
          return manifest;
        }, seed);
      }

      const isLastEmit = emitCount === 0;
      if (isLastEmit) {
        const output = this.options.serialize(manifest);

        compilation.assets[outputName] = {
          source() {
            return output;
          },
          size() {
            return output.length;
          }
        };

        if (this.options.writeToFileEmit) {
          fse.outputFileSync(outputFile, output);
        }
      }

      if (compiler.hooks) {
        getCompilerHooks(compiler).afterEmit.call(manifest);
      } else {
        compilation.applyPluginsAsync(
          'webpack-manifest-plugin-after-emit',
          manifest,
          compileCallback
        );
      }
    }.bind(this);

    function beforeRun(compiler, callback) {
      const emitCount = emitCountMap.get(outputFile) || 0;
      emitCountMap.set(outputFile, emitCount + 1);

      if (callback) {
        callback();
      }
    }

    const pluginOptions = {
      name: 'WebpackManifestPlugin',
      stage: Infinity
    };

    compiler.hooks.compilation.tap(pluginOptions, (compilation) => {
      compilation.hooks.moduleAsset.tap(pluginOptions, moduleAsset);
    });
    compiler.hooks.emit.tap(pluginOptions, emit);
    compiler.hooks.run.tap(pluginOptions, beforeRun);
    compiler.hooks.watchRun.tap(pluginOptions, beforeRun);
  }
}

module.exports = { getCompilerHooks, WebpackManifestPlugin };
