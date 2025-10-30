module.exports = {
  extends: ["shellscape/typescript"],
  parserOptions: {
    project: ["./tsconfig.eslint.json"],
    tsconfigRootDir: __dirname,
  },
  settings: {
    'import/resolver': {
      typescript: {
        // Use the ESLint tsconfig which includes tests
        project: './tsconfig.eslint.json',
        alwaysTryTypes: true
      },
      node: {
        extensions: ['.js', '.mjs', '.cjs', '.ts', '.mts', '.cts', '.d.ts']
    // Ensure import/no-unresolved can resolve NodeNext + TS paths where source files
    // use .js specifiers that map to .ts during authoring.
    'import/resolver': {
      typescript: {
        project: ['./tsconfig.eslint.json']
      },
      node: {
        extensions: ['.js', '.ts', '.d.ts']
      }
    }
  }
};
