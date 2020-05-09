const path = require('path');

module.exports = {
  entry: path.resolve(__dirname, 'src', 'renderMd.js'),
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  mode: 'production',
};
