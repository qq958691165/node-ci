const ch = require('child_process');
const os = require('os');
const path = require('path');
const fs = require('fs');
const express = require('express');
const config = require('./config');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

let project_commands={};

app.post('/', (req, res) => {

    if (config.key !== req.body.key) {
        res.sendStatus(403);
        return;
    }
    if (!req.body.project || !req.body.command) {
        res.sendStatus(401);
        return;
    }

    let command = null;
    try {
        command = require('./Commands/' + req.body.command);
    } catch (e) {
    }
    if (!command || !command.command) {
        res.sendStatus(500);
        return;
    }

    let pc_key=req.body.project+'___'+req.body.command;
    if (project_commands[pc_key] && config.command_limit){
        res.sendStatus(501);
        return;
    }

    project_commands[pc_key]=1;
    let run_command = command.command;
    let cwd=config.projectDir + path.sep + req.body.project;
    if (!fs.existsSync(cwd)){
        res.sendStatus(404);
        return;
    }
    let cp_opt={
        env:{
            CI_ARGS:JSON.stringify(req.body)
        },
        cwd:cwd
    };

    let cp=ch.exec(run_command,cp_opt, (error, stdout, stderr) => {
        project_commands[pc_key]=0;
        if (error instanceof Error) {
            res.status(502).send(stderr+'\n*****CI_ERR*****\n');
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