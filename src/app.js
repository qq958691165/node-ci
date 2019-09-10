const ch = require('child_process');
const os = require('os');
const path = require('path');
const fs = require('fs');
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
    if (project_commands[pc_key] && config.command_limit){
        res.sendStatus(501);
        return;
    }

    project_commands[pc_key]=1;
    let run_command = command.command;
    let cwd=config.projectDir + path.sep + req.query.project;
    if (!fs.existsSync(cwd)){
        res.sendStatus(404);
        return;
    }
    let cp_opt={
        env:{
            CI_ARGS:JSON.stringify(req.query)
        },
        cwd:cwd
    };

    let cp=ch.exec(run_command,cp_opt, (error, stdout, stderr) => {
        if (error instanceof Error) {
            res.status(502).send(stderr);
        } else {
            res.send(stdout);
        }
    });
    if (config.request_limit) {
        req.socket.addListener('close', () => {
            if (os.platform() === "win32") {
                ch.spawn('taskkill', ['/pid', cp.pid, '-t', '-f']);
            } else {
                ch.spawn('kill', ['-9', cp.pid]);
            }
            delete project_commands[pc_key];
            console.log('kill');
        });
    }
});

app.listen(config.port, () => {
    console.log('start port ' + config.port);
});