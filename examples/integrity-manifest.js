const ManifestPlugin = require('webpack-manifest-plugin');
const crypto = require('crypto');

/**
 * This example returns a manifest object containing
 * each path with a integrity hash:
 *
 * {
 *  "main.bd17d3636cb.js": "sha256-4a97d363df66cd8a4f4bd16cb80026bcf50fd9233761de21c34a5b55293345d2"
 * }
 *
 * It can be used in combination with for example the
 * webpack-subresource-integrity package.
 */
module.exports = {
  plugins: [
    new ManifestPlugin({
      generate: (seed, files, entrypoints, compilation) => {
        return files.reduce((manifest, { path, name }) => {
          const compilationAsset = compilation.assets[name];
          // Use 'integrity' as set by webpack-subresource-integrity or
          // generate a new hash
          const integrity = compilationAsset ? compilationAsset.integrity || createIntegrityHash(compilationAsset.source()) : null;
          return { ...manifest, [path]: integrity };
        }, seed);
      }
    }),
  ]
};

function createIntegrityHash(content, algorithm = 'sha256') {
  const hash = crypto.createHash(algorithm)
    .update(content, 'utf-8')
    .digest('hex');
  return algorithm + '-' + hash;
}