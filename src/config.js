const env = process.env;
const path = require('path');

module.exports = {
    port: env.CI_PORT || 3000,
    projectDir: env.PROJECT_DIR || path.resolve('./projects'),
    key: env.CI_KEY || 'MTIzNDU2Nzg=',
    command_limit: env.COMMAND_LIMIT ? eval(env.COMMAND_LIMIT.toLowerCase()) : true,
    request_limit: env.REQUEST_LIMIT ? eval(env.REQUEST_LIMIT.toLowerCase()) : true,
};