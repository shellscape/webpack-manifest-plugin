import { mkdirSync, writeFileSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';

import { SyncWaterfallHook } from 'tapable';
import type { Compiler, Module, Compilation, LoaderContext } from 'webpack';
// Note: This was the old delcaration. It appears to be Webpack v3 compat.
// const { RawSource } = (webpack as any).sources || require('webpack-sources');
import { RawSource } from 'webpack-sources';

import type { EmitCountMap, InternalOptions } from './index.js';

import type { CompilationAsset, FileDescriptor } from './helpers.js';
import { generateManifest, reduceAssets, reduceChunk, transformFiles } from './helpers.js';

interface BeforeRunHookArgs {
  emitCountMap: EmitCountMap;
  manifestFileName: string;
}

interface EmitHookArgs {
  compiler: Compiler;
  emitCountMap: EmitCountMap;
  manifestAssetId: string;
  manifestFileName: string;
  moduleAssets: Record<any, any>;
  options: InternalOptions;
}

interface EmitCompilation {
  emitAsset: Function;
}

const compilerHookMap = new WeakMap();

const getCompilerHooks = (compiler: Compiler) => {
  let hooks = compilerHookMap.get(compiler);
  if (typeof hooks === 'undefined') {
    hooks = {
      afterEmit: new SyncWaterfallHook(['manifest']),
      beforeEmit: new SyncWaterfallHook(['manifest'])
    };
    compilerHookMap.set(compiler, hooks);
  }
  return hooks;
};

const beforeRunHook = (
  { emitCountMap, manifestFileName }: BeforeRunHookArgs,
  _: Compiler,
  callback: Function
) => {
  const emitCount = emitCountMap.get(manifestFileName) || 0;
  emitCountMap.set(manifestFileName, emitCount + 1);

  /* istanbul ignore next */
  if (callback) {
    callback();
  }
};

const emitHook = function emit(
  {
    compiler,
    emitCountMap,
    manifestAssetId,
    manifestFileName,
    moduleAssets,
    options
  }: EmitHookArgs,
  compilation: Compilation
) {
  const emitCount = emitCountMap.get(manifestFileName) - 1;
  // Disable everything we don't use, add asset info, show cached assets
  const stats = compilation.getStats().toJson({
    all: false,
    assets: true,
    cachedAssets: true,
    // Note: Webpack v5 compat
    ids: true,
    publicPath: true
  });

  // Webpack v5 supports `output.publicPath: 'auto'`, which resolves the publicPath
  // at runtime based on the current script/asset location. In that mode, the
  // string value 'auto' should not be serialized into the manifest. Treat it as
  // an "unset" publicPath so manifest values remain unprefixed and consumers can
  // resolve at runtime. See https://webpack.js.org/guides/public-path/#automatic-publicpath
  const resolvedPublicPath = options.publicPath !== null ? options.publicPath : stats.publicPath;
  const publicPath = resolvedPublicPath === 'auto' ? '' : resolvedPublicPath;
  const { basePath, removeKeyHash } = options;

  emitCountMap.set(manifestFileName, emitCount);

  const auxiliaryFiles: Record<any, any> = {};
  let files = Array.from(compilation.chunks).reduce<FileDescriptor[]>(
    (prev: FileDescriptor[], chunk: any) => reduceChunk(prev, chunk, options, auxiliaryFiles),
    [] as FileDescriptor[]
  );

  // module assets don't show up in assetsByChunkName, we're getting them this way
  files = (stats.assets! as unknown as CompilationAsset[]).reduce(
    (prev, asset) => reduceAssets(prev, asset, moduleAssets),
    files
  );

  // don't add hot updates and don't add manifests from other instances
  files = files.filter(
    ({ name, path }: { name: string; path: string }) =>
      !path.includes('hot-update') &&
      typeof emitCountMap.get(join(compiler.options.output?.path || '<unknown>', name)) ===
        'undefined'
  );

  // auxiliary files are "extra" files that are probably already included
  // in other ways. Loop over files and remove any from auxiliaryFiles
  files.forEach((file: FileDescriptor) => {
    delete auxiliaryFiles[file.path];
  });
  // if there are any auxiliaryFiles left, add them to the files
  // this handles, specifically, sourcemaps
  Object.keys(auxiliaryFiles).forEach((auxiliaryFile) => {
    files = files.concat(auxiliaryFiles[auxiliaryFile]);
  });

  files = files.map((file: FileDescriptor) => {
    const normalizePath = (path: string): string => {
      if (!path.endsWith('/')) {
        return `${path}/`;
      }

      return path;
    };

    const changes = {
      // Append optional basepath onto all references. This allows output path to be reflected in the manifest.
      name: basePath ? normalizePath(basePath) + file.name : file.name,
      // Similar to basePath but only affects the value (e.g. how output.publicPath turns
      // require('foo/bar') into '/public/foo/bar', see https://github.com/webpack/docs/wiki/configuration#outputpublicpath
      path: publicPath ? normalizePath(publicPath) + file.path : file.path
    };

    // Fixes #210
    changes.name = removeKeyHash ? changes.name.replace(removeKeyHash, '') : changes.name;

    return Object.assign(file, changes);
  });

  files = transformFiles(files, options);

  let manifest = generateManifest(compilation, files, options);
  const isLastEmit = emitCount === 0;

  manifest = getCompilerHooks(compiler).beforeEmit.call(manifest);

  if (isLastEmit) {
    const output = options.serialize(manifest);

    (compilation as unknown as EmitCompilation).emitAsset(manifestAssetId, new RawSource(output));

    if (options.writeToFileEmit) {
      mkdirSync(dirname(manifestFileName), { recursive: true });
      writeFileSync(manifestFileName, output);
    }
  }

  getCompilerHooks(compiler).afterEmit.call(manifest);
};

interface LegacyModule extends Module {
  userRequest?: any;
}

const normalModuleLoaderHook = (
  { moduleAssets }: { moduleAssets: Record<any, any> },
  context: unknown,
  module: LegacyModule
) => {
  const loaderContext = context as LoaderContext<any>;
  const { emitFile } = loaderContext;

  loaderContext.emitFile = (file: string, content: string, sourceMap: any) => {
    if (module.userRequest && !moduleAssets[file]) {
      Object.assign(moduleAssets, { [file]: join(dirname(file), basename(module.userRequest)) });
    }

    return emitFile.call(module, file, content, sourceMap);
  };
};

export { beforeRunHook, emitHook, getCompilerHooks, normalModuleLoaderHook };
