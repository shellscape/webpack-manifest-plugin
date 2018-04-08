# Webpack Manifest Plugin [![Build Status](https://travis-ci.org/danethurber/webpack-manifest-plugin.svg?branch=master)](https://travis-ci.org/danethurber/webpack-manifest-plugin)  [![codecov](https://codecov.io/gh/danethurber/webpack-manifest-plugin/badge.svg?branch=master)](https://codecov.io/gh/danethurber/webpack-manifest-plugin?branch=master) [![Gitter](https://img.shields.io/gitter/room/nwjs/nw.js.svg)](https://gitter.im/webpack-manifest-plugin#)


Webpack plugin for generating an asset manifest.

> NOTE: The following is related to the next major version of `webpack-manifest-plugin`, please check https://github.com/danethurber/webpack-manifest-plugin/blob/1.x/README.md for `v1` documentation

## Install

```bash
npm install --save-dev webpack-manifest-plugin
```

## Usage

In your `webpack.config.js`

```javascript
var ManifestPlugin = require('webpack-manifest-plugin');

module.exports = {
    // ...
    plugins: [
      new ManifestPlugin()
    ]
};
```

This will generate a `manifest.json` file in your root output directory with a mapping of all source file names to their corresponding output file, for example:

```json
{
  "mods/alpha.js": "mods/alpha.1234567890.js",
  "mods/omega.js": "mods/omega.0987654321.js"
}
```


## API:

```js
// webpack.config.js

module.exports = {
  output: {
    publicPath
  },
  plugins: [
    new ManifestPlugin(options)
  ]
}
```

### `options.fileName`

Type: `String`<br>
Default: `manifest.json`

The manifest filename in your output directory.

### `options.publicPath`

Type: `String`
Default: `output.publicPath`

A path prefix that will be added to values of the manifest.

### `options.basePath`

Type: `String`

A path prefix for all keys. Useful for including your output path in the manifest.


### `options.writeToFileEmit`

Type: `Boolean`<br>
Default: `false`

If set to `true` will emit to build folder and memory in combination with `webpack-dev-server`


### `options.seed`

Type: `Object`<br>
Default: `{}`

A cache of key/value pairs to used to seed the manifest. This may include a set of [custom key/value](https://developer.mozilla.org/en-US/Add-ons/WebExtensions/manifest.json) pairs to include in your manifest, or may be used to combine manifests across compilations in [multi-compiler mode](https://github.com/webpack/webpack/tree/master/examples/multi-compiler). To combine manifests, pass a shared seed object to each compiler's ManifestPlugin instance.

### `options.filter`

Type: `function`

Filter out files. [more details](#hooks-options)


### `options.map`

Type: `function`

Modify files details before the manifest is created. [more details](#hooks-options)

### `options.sort`

Type: `function`

Sort files before they are passed to `generate`. [more details](#hooks-options)

### `options.generate`

Type: `function`<br>
Default: `(seed, files) => files.reduce((manifest, {name, path}) => ({...manifest, [name]: path}), seed)`

All entries in `files` correspond to the object structure described in the `Hooks Options` section.

Create the manifest. It can return anything as long as it's serialisable by `JSON.stringify`. [more details](#hooks-options)

### `options.serialize`

Type: `function`<br>
Default: `(manifest) => JSON.stringify(manifest, null, 2)`

Output manifest file in different format then json (i.e. yaml).

## Hooks Options

`filter`, `map`, `sort` takes as an input an Object with the following properties:

### `path`

Type: `String`


### `chunk`

Type: [`Chunk`](https://github.com/webpack/webpack/blob/master/lib/Chunk.js)


### `name`

Type: `String`, `null`


### `isChunk`

Type: `Boolean`


### `isInitial`

Type: `Boolean`

Is required to run you app. Cannot be `true` if `isChunk` is `false`.


### `isAsset`

Type: `Boolean`


### `isModuleAsset`

Type: `Boolean`

Is required by a module. Cannot be `true` if `isAsset` is `false`.


## License

MIT © [Dane Thurber](https://github.com/danethurber)
