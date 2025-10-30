import fs from 'node:fs';
import { join, isAbsolute } from 'node:path';

import webpack from 'webpack';
import { merge } from 'webpack-merge';

import { WebpackManifestPlugin } from '../../src/index.js';

const { log } = console;

const applyDefaults = (webpackOpts: any, manifestOptions: any) => {
  const defaults = {
    optimization: { chunkIds: 'named' },
    output: {
      filename: '[name].js',
      publicPath: ''
    },
    plugins: [new WebpackManifestPlugin(manifestOptions)]
  } as const;
  return merge(defaults, webpackOpts);
};

export const hashLiteral = '[fullhash]';

const prepare = (webpackOpts: any, manifestOptions: any) => {
  if (Array.isArray(webpackOpts)) {
    return webpackOpts.map((opts) => applyDefaults(opts, manifestOptions));
  }
  return applyDefaults(webpackOpts, manifestOptions);
};

const flatten = (array: any[]) => (array.length > 1 ? array : array[0]);

export const compile = (config: any, t: any, manifestOptions: any = {}) => {
  const configs = flatten([config].map((options) => prepare(options, manifestOptions)));
  const compiler = webpack(configs);

  return new Promise<{ fs: typeof fs; manifest: any; stats: webpack.Stats }>((p, f) => {
    compiler.run((error, stats) => {
      if (error) {
        f(error);
        return;
      }

      const outputPath = ([] as any[]).concat(configs)[0].output.path as string;
      let manifestPath = join(outputPath, (manifestOptions.fileName as string) || 'manifest.json');

      if (isAbsolute((manifestOptions.fileName as string) || '')) {
        manifestPath = manifestOptions.fileName as string;
      }

      let manifest: any = fs.readFileSync(manifestPath).toString();

      try {
        manifest = JSON.parse(manifest);
      } catch {
        // ignored
      }

      if (stats!.hasErrors()) {
        log('Stat Errors', stats!.toJson());
      }

      t.is(stats!.hasErrors(), false);

      p({ fs, manifest, stats: stats! });
    });
  });
};
