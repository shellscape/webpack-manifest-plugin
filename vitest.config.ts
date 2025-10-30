import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['test/**/*.ts'],
    exclude: ['test/helpers/**/*.ts'],
    resolveSnapshotPath: (testPath, snapExtension) => {
      return path.join(path.dirname(testPath), '.snapshots', path.basename(testPath) + snapExtension);
    },
  },
});
