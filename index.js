const ch = require('child_process');
const fs = require('fs');
const path = require('path');
const dotEnv = require('dotenv');

dotEnv.config();

let appProcess = ch.fork(path.resolve('./src/app'));

if (process.env.MODE === 'dev') {
    fs.watch(path.resolve('./src'), (event, filename) => {
        appProcess.kill();
        appProcess = ch.fork(path.resolve('./src/app'));
    });
}