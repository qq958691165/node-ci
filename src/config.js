const env = process.env;
const path = require('path');

module.exports = {
    port: env.CI_PORT || 3000,
    projectDir: env.PROJECT_DIR || path.resolve('./projects'),
    key: env.CI_KEY || 'MTIzNDU2Nzg='
};