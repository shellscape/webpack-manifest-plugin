import { dirname, join, basename } from 'node:path';

import type { AssetInfo, Chunk, Asset, Compilation } from 'webpack';

import type { InternalOptions, Manifest } from './index.js';

export interface FileDescriptor {
  chunk?: Chunk;
  isAsset: Boolean;
  isChunk: Boolean;
  isInitial: Boolean;
  isModuleAsset: Boolean;
  name: string;
  path: string;
}

export interface CompilationAssetInfo extends AssetInfo {
  sourceFilename: string;
}

export interface CompilationAsset extends Asset {
  chunks: any[];
  info: CompilationAssetInfo;
}

const generateManifest = (
  compilation: Compilation,
  files: FileDescriptor[],
  { generate, seed = {} }: InternalOptions
) => {
  let result: Manifest;
  if (generate) {
    const entrypointsArray = Array.from(compilation.entrypoints.entries());
    const entrypoints = entrypointsArray.reduce(
      (e, [name, entrypoint]) => Object.assign(e, { [name]: entrypoint.getFiles() }),
      {} as Record<string, any>
    );
    result = generate(seed, files, entrypoints, compilation.chunkGraph);
  } else {
    result = files.reduce(
      (manifest, file) => Object.assign(manifest, { [file.name]: file.path }),
      seed
    );
  }

  return result;
};

const getFileType = (fileName: string, { transformExtensions }: InternalOptions) => {
  const replaced = fileName.replace(/\?.*/, '');
  const split = replaced.split('.');
  const extension = split.pop();
  return transformExtensions.test(extension!) ? `${split.pop()}.${extension}` : extension;
};

const reduceAssets = (
  files: FileDescriptor[],
  asset: CompilationAsset,
  moduleAssets: Record<any, any>
) => {
  let name;
  if (moduleAssets[asset.name]) {
    name = moduleAssets[asset.name];
  } else if (asset.info.sourceFilename) {
    name = join(dirname(asset.name), basename(asset.info.sourceFilename));
  }

  if (name) {
    return files.concat({
      isAsset: true,
      isChunk: false,
      isInitial: false,
      isModuleAsset: true,
      name,
      path: asset.name
    });
  }

  const isEntryAsset = asset.chunks && asset.chunks.length > 0;
  if (isEntryAsset) {
    return files;
  }

  return files.concat({
    isAsset: true,
    isChunk: false,
    isInitial: false,
    isModuleAsset: false,
    name: asset.name,
    path: asset.name
  });
};

const reduceChunk = (
  files: FileDescriptor[],
  chunk: Chunk,
  options: InternalOptions,
  auxiliaryFiles: Record<any, any>
) => {
  // auxiliary files contain things like images, fonts AND, most
  // importantly, other files like .map sourcemap files
  // we modify the auxiliaryFiles so that we can add any of these
  // to the manifest that was not added by another method
  // (sourcemaps files are not added via any other method)
  Array.from(chunk.auxiliaryFiles || []).forEach((auxiliaryFile) => {
    auxiliaryFiles[auxiliaryFile] = {
      isAsset: true,
      isChunk: false,
      isInitial: false,
      isModuleAsset: true,
      name: basename(auxiliaryFile),
      path: auxiliaryFile
    };
  });

  return Array.from(chunk.files).reduce((prev, path) => {
    let name = chunk.name ? chunk.name : null;
    // chunk name, or for nameless chunks, just map the files directly.
    name = name
      ? options.useEntryKeys && !path.endsWith('.map')
        ? name
        : `${name}.${getFileType(path, options)}`
      : path;

    return prev.concat({
      chunk,
      isAsset: false,
      isChunk: true,
      isInitial: chunk.isOnlyInitial(),
      isModuleAsset: false,
      name,
      path
    });
  }, files);
};

const standardizeFilePaths = (file: FileDescriptor) => {
  const result = Object.assign({}, file);
  result.name = file.name.replace(/\\/g, '/');
  result.path = file.path.replace(/\\/g, '/');
  return result;
};

const transformFiles = (files: FileDescriptor[], options: InternalOptions) =>
  ['filter', 'map', 'sort']
    .filter((fname: string) => !!options[fname])
    // TODO: deprecate these
    .reduce(
      // Note: We want to access the filter, map, and sort functions on an array. TS sucks at this
      // so we cast to something it can't complain about
      (prev, fname: string) => (prev as unknown as Record<string, Function>)[fname](options[fname]),
      files
    )
    .map(standardizeFilePaths);

export { generateManifest, reduceAssets, reduceChunk, transformFiles };
