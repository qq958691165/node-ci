const ch = require('child_process');
const os = require('os');
const path = require('path');
const express = require('express');
const config = require('./config');

const app = express();

let project_commands={};

app.get('/', (req, res) => {
    if (config.key !== req.query.key) {
        res.sendStatus(403);
        return;
    }
    if (!req.query.project || !req.query.command) {
        res.sendStatus(401);
        return;
    }

    let command = null;
    try {
        command = require('./Commands/' + req.query.command);
    } catch (e) {
    }
    if (!command || !command.command) {
        res.sendStatus(500);
        return;
    }

    let pc_key=req.query.project+'___'+req.query.command;
    if (project_commands[pc_key]){
        res.sendStatus(501);
        return;
    }

    project_commands[pc_key]=1;
    let run_command = 'cd ' + config.projectDir + path.sep + req.query.project;
    run_command += ' && ' + command.command;
    process.env.CI_ARGS=JSON.stringify(req.query);
    let cp=ch.exec(run_command, (error, stdout, stderr) => {
        if (error instanceof Error) {
            res.status(502).send(stderr);
        } else {
            res.send(stdout);
        }
    });
    req.socket.addListener('close',()=>{
        if (os.platform()==="win32"){
            ch.spawn('taskkill',['/pid',cp.pid,'-t','-f']);
        }else{
            ch.spawn('kill',['-9',cp.pid]);
        }
        delete project_commands[pc_key];
        console.log('kill');
    });
});

app.listen(config.port, () => {
    console.log('start port ' + config.port);
});