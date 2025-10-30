module.exports = {
  extends: ["shellscape/typescript"],
  parserOptions: {
    project: ["./tsconfig.eslint.json"],
    tsconfigRootDir: __dirname,
  },
  settings: {
    // Resolve ESM-style .js specifiers to TypeScript source under NodeNext
    'import/resolver': {
      typescript: {
        project: './tsconfig.eslint.json'
      },
      node: {
        extensions: ['.js', '.ts', '.d.ts']
      }
    }
  }
};
