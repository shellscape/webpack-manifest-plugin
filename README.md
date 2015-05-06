# Webpack Manifest Plugins

Webpack plugin for generating an asset manifest.

[![Circle CI](https://circleci.com/gh/danethurber/webpack-manifest-plugin.svg?style=shield)](https://circleci.com/gh/danethurber/webpack-manifest-plugin)


## Usage

In your webpack.config.js

```javascript
var ManifestPlugin = require('webpack-manifest-plugin');

module.exports = {
    // ...
    plugins: [
      new ManifestPlugin()
    ]
};
```
