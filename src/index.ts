import { relative, resolve } from 'path';

import { SyncHook } from 'tapable';
import type { Compiler, WebpackPluginInstance, Compilation } from 'webpack';
import { FileDescriptor } from './helpers';
import { beforeRunHook, emitHook, getCompilerHooks, normalModuleLoaderHook } from './hooks';

const emitCountMap: EmitCountMap = new Map();

export type Manifest = Record<string, any>;

export interface InternalOptions {
  [key: string]: any;
  assetHookStage: number;
  basePath: string;
  fileName: string;
  filter: (file: FileDescriptor) => Boolean;
  generate: (
    seed: Record<any, any>,
    files: FileDescriptor[],
    entries: Record<string, string[]>
  ) => Manifest;
  map: (file: FileDescriptor) => FileDescriptor;
  publicPath: string;
  removeKeyHash: RegExp | false;
  seed: Record<any, any>;
  serialize: (manifest: Manifest) => string;
  sort: (fileA: FileDescriptor, fileB: FileDescriptor) => Number;
  transformExtensions: RegExp;
  useEntryKeys: Boolean;
  useLegacyEmit: Boolean;
  writeToFileEmit: Boolean;
}

export type ManifestPluginOptions = Partial<InternalOptions>;

const defaults = {
  assetHookStage: Infinity,
  basePath: '',
  fileName: 'manifest.json',
  filter: null,
  generate: void 0,
  map: null,
  publicPath: null,
  removeKeyHash: /([a-f0-9]{16,32}\.?)/gi,
  // Note: seed must be reset for each compilation. let the code initialize it to {}
  seed: void 0,
  serialize(manifest: any) {
    return JSON.stringify(manifest, null, 2);
  },
  sort: null,
  transformExtensions: /^(gz|map)$/i,
  useEntryKeys: false,
  useLegacyEmit: false,
  writeToFileEmit: false
};

export type EmitCountMap = Map<any, any>;

interface Webpack5Hooks {
  processAssets: SyncHook<Compilation, any>;
}

class WebpackManifestPlugin implements WebpackPluginInstance {
  private options: InternalOptions;
  constructor(opts: ManifestPluginOptions) {
    this.options = Object.assign({}, defaults, opts);
  }

  apply(compiler: Compiler) {
    const { NormalModule } = compiler.webpack;
    const moduleAssets = {};
    const manifestFileName = resolve(compiler.options.output?.path || './', this.options.fileName);
    const manifestAssetId = relative(compiler.options.output?.path || './', manifestFileName);
    const beforeRun = beforeRunHook.bind(this, { emitCountMap, manifestFileName });
    const emit = emitHook.bind(this, {
      compiler,
      emitCountMap,
      manifestAssetId,
      manifestFileName,
      moduleAssets,
      options: this.options
    });
    const normalModuleLoader = normalModuleLoaderHook.bind(this, { moduleAssets });
    const hookOptions = {
      name: 'WebpackManifestPlugin',
      stage: this.options.assetHookStage
    };

    compiler.hooks.compilation.tap(hookOptions, (compilation) => {
      const hook = !NormalModule.getCompilationHooks
        ? compilation.hooks.normalModuleLoader
        : NormalModule.getCompilationHooks(compilation).loader;
      hook.tap(hookOptions, normalModuleLoader);
    });

    if (this.options.useLegacyEmit === true) {
      compiler.hooks.emit.tap(hookOptions, emit);
    } else {
      compiler.hooks.thisCompilation.tap(hookOptions, (compilation) => {
        (compilation.hooks as unknown as Webpack5Hooks).processAssets.tap(hookOptions, () =>
          emit(compilation)
        );
      });
    }

    compiler.hooks.run.tapAsync(hookOptions, beforeRun);
    compiler.hooks.watchRun.tapAsync(hookOptions, beforeRun);
  }
}

export { getCompilerHooks, WebpackManifestPlugin };
