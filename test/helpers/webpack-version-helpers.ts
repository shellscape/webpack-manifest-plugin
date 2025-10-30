import webpack from 'webpack';

const isWebpackVersionGte = (minVersion: number) =>
  // @ts-ignore version exists on webpack v5
  (webpack as any).version && parseInt((webpack as any).version.slice(0, 1), 10) >= minVersion;

const getAsset = (compilation: any, assetName: string) =>
  isWebpackVersionGte(5)
    ? compilation.emittedAssets.has(assetName)
    : compilation.assets[assetName].emitted;

export { getAsset };
