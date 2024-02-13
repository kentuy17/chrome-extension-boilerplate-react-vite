const utils = require('./utils');
const fse = require('fs-extra');

Promise.all([
  fse.copy('../src', 'output/src'),
  // fse.copy('../.env', 'output/.env'),
  fse.copy('../.gitignore', 'output/.gitignore'),
  fse.copy('../public', 'output/public'),
  fse.copy('../package.json', 'output/package.json'),
  fse.copy('../README.md', 'output/README.md'),
])
  .then(() => {
    utils.createJsConfig('output/jsconfig.json');

    const allFiles = utils.buildTree('output/src');
    utils.transformTsToJs(allFiles);
  })
  .catch((err) => console.log(err));