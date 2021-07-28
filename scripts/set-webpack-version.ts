/*
 * This file sets Webpack version - both devDependencies and peerDependencies.
 *
 * This is, for some reason, needed with Windows and maybe npm 6. Running
 * "npm install webpack -D" AND manually updating the peerDependencies
 * (because npm 6 does not do that but npm 7 does) is not enough. For some
 * reason why must, by hand, update the package.json file first and then
 * run a normal "npm install".
 */
import { writeFileSync } from 'fs';
import { join } from 'path';

import pkg from '../package.json';

type Deps = Record<string, string>;
type Versions = Record<string, Record<string, string>>;

const [, , version] = process.argv;
const { log } = console;

if (!version) {
  log('Please pass a webpack version major as the last argument. e.g. "4" or "5"');
  process.exit(1);
}

const versions = (pkg['webpack-versions'] as Versions)[version];

pkg.peerDependencies.webpack = versions.webpack;

Object.keys(versions).forEach((key) => ((pkg.devDependencies as Deps)[key] = versions[key]));

writeFileSync(join(__dirname, '../package.json'), JSON.stringify(pkg, null, 2));
