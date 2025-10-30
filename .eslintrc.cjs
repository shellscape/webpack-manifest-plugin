module.exports = {
  extends: ["shellscape/typescript"],
  parserOptions: {
    project: ["./tsconfig.eslint.json"],
    tsconfigRootDir: __dirname,
  }
};
