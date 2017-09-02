const program = require('commander');
const packageConf = require('../package.json');

program
.version(packageConf.version)
.parse(process.argv);
