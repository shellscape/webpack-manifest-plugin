const generateManifest = (compilation, files, { generate, seed = {} }) => {
  let result;
  if (generate) {
    const entrypointsArray = Array.from(compilation.entrypoints.entries());
    const entrypoints = entrypointsArray.reduce(
      (e, [name, entrypoint]) => Object.assign(e, { [name]: entrypoint.getFiles() }),
      {}
    );
    result = generate(seed, files, entrypoints);
  } else {
    result = files.reduce(
      (manifest, file) => Object.assign(manifest, { [file.name]: file.path }),
      seed
    );
  }

  return result;
};

const getFileType = (fileName, { transformExtensions }) => {
  const replaced = fileName.replace(/\?.*/, '');
  const split = replaced.split('.');
  const extension = split.pop();
  return transformExtensions.test(extension) ? `${split.pop()}.${extension}` : extension;
};

const reduceAssets = (files, asset, moduleAssets) => {
  const name = moduleAssets[asset.name] ? moduleAssets[asset.name] : asset.info.sourceFilename;
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

  const isEntryAsset = asset.chunks && asset.chunks.length > 0;
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
  Array.of(...Array.from(chunk.files), ...Array.from(chunk.auxiliaryFiles || [])).reduce(
    (prev, path) => {
      let name = chunk.name ? chunk.name : null;
      // chunk name, or for nameless chunks, just map the files directly.
      name = name
        ? options.useEntryKeys && !path.endsWith('.map')
          ? name
          : `${name}.${getFileType(path, options)}`
        : path;

      return prev.concat({
        path,
        chunk,
        name,
        isInitial: chunk.isOnlyInitial(),
        isChunk: true,
        isAsset: false,
        isModuleAsset: false
      });
    },
    files
  );

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

module.exports = { generateManifest, reduceAssets, reduceChunk, transformFiles };
