const standardizeFilePaths = (file) => {
  const result = Object.assign({}, file);
  result.name = file.name.replace(/\\/g, '/');
  result.path = file.path.replace(/\\/g, '/');
  return result;
};

module.exports = { standardizeFilePaths };
