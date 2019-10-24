const path = require('path');

const webpack = require('webpack');
const tempy = require('tempy');
const fse = require('fs-extra');

const ManifestPlugin = require('../../index.js');

module.exports = {
  compile,
  watch
};

async function compile(webpackConfig, { useMemoryFs = false } = {}) {
  const outputDir = tempy.directory();

  const compiler = webpack({
    ...webpackConfig,
    output: {
      ...webpackConfig.output,
      path: outputDir,
    },
  });

  await new Promise((resolve, reject) =>  {
    compiler.run((err, stats) => {
      if (err) {
        return reject(err);
      }

      resolve(stats)
    });
  });

  let manifest;
  const manifests = [];

  await Promise.all(
    compiler.options.plugins
    .filter(p => p instanceof ManifestPlugin)
    .map(async manifestPlugin => {
      const manifestFileName = manifestPlugin.opts.fileName || 'manifest.json';


      const manifestFileContent = await fse.readFile(path.join(outputDir, manifestFileName), { encoding: 'utf-8' });
      const m = JSON.parse(manifestFileContent)

      manifest = m;
      manifests.push(m);
    })
  );

  const files = await fse.readdir(outputDir);

  return {
    manifest,
    manifests,
    files,
  };
}

function watch() {

}
