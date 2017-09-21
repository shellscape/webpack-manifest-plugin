var plugin = require('../../index.js');
var webpack = require('webpack');
var _ = require('lodash');
var toposort = require('toposort');

function generate(seed, files) {
  var nodeMap = {};

  files.forEach(function (file) {
    nodeMap[file.chunk.id] = file;
  });

  var edges = [];

  files.forEach(function (file) {
    if (file.chunk.parents) {
      file.chunk.parents.forEach(function (parent) {
        var parentFile = _.isObject(parent) ? nodeMap[parent.id] : nodeMap[parent];
        if (parentFile) {
          edges.push([parentFile, file]);
        }
      });
    }
  });

  const sortedFiles = toposort.array(files, edges);

  return sortedFiles.reduce(function(manifest, file) {
    return manifest.concat({ name: file.name, path: file.path });
  }, seed);
}


module.exports = {
  context: __dirname,
  entry: {
    main: './main.js',
    vendor: './util.js'
  },
  output: {
    filename: '[name].out.js'
  },
  plugins: [
    new plugin({
      seed: [],
      generate: generate
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'common',
      filename: 'common.out.js'
    })
  ]
};
