const getFileType = (fileName, { transformExtensions }) => {
  const replaced = fileName.replace(/\?.*/, '');
  const split = replaced.split('.');
  const extension = split.pop();
  return transformExtensions.test(extension) ? `${split.pop()}.${extension}` : extension;
};

const reduceAssets = (files, asset, moduleAssets) => {
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
};

const reduceChunk = (files, chunk, options) =>
  chunk.files.reduce((prev, path) => {
    let name = chunk.name ? chunk.name : null;
    // chunk name, or for nameless chunks, just map the files directly.
    name = name ? `${name}.${getFileType(path, options)}` : path;

    return prev.concat({
      path,
      chunk,
      name,
      isInitial: chunk.isOnlyInitial(),
      isChunk: true,
      isAsset: false,
      isModuleAsset: false
    });
  }, files);

const standardizeFilePaths = (file) => {
  const result = Object.assign({}, file);
  result.name = file.name.replace(/\\/g, '/');
  result.path = file.path.replace(/\\/g, '/');
  return result;
};

const transformFiles = (files, options) =>
  ['filter', 'map', 'sort']
    .filter((fname) => !!options[fname])
    // TODO: deprecate these
    .reduce((prev, fname) => prev[fname](options[fname]), files)
    .map(standardizeFilePaths);

module.exports = { reduceAssets, reduceChunk, transformFiles };
