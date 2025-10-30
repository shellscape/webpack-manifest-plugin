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
      }
    }
  }
};
