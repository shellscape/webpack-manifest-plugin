/*
 * This file sets Webpack version - both devDependencies and peerDependencies.
 *
 * This is, for some reason, needed with Windows and maybe npm 6. Running
 * "npm install webpack -D" AND manually updating the peerDependencies
 * (because npm 6 does not do that but npm 7 does) is not enough. For some
 * reason why must, by hand, update the package.json file first and then
 * run a normal "npm install".
 */
const fs = require('fs');
const path = require('path');

const version = process.argv[2];
if (!version) {
  console.log('Please pass the webpack version - "^4" or "^5" - as an argument.');

  process.exit(1);
}

const packageData = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json')));
packageData.peerDependencies.webpack = version;

packageData.devDependencies.webpack = version;

fs.writeFileSync(path.join(__dirname, 'package.json'), JSON.stringify(packageData, null, 2));
