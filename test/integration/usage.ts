import { execSync } from 'node:child_process';

import test from '../helpers/ava-compat';

// make implicit dependency explicit:
import '../../src/index';

test.before(() => execSync('pnpm build'));

test('can be used as documented', (t) => {
  const readmeCode = "import { WebpackManifestPlugin } from 'webpack-manifest-plugin'";

  t.deepEqual(execSync(`node -e "${readmeCode}"`, { encoding: 'utf-8' }), '');
});
