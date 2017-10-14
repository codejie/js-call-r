'use strict'

const child_process = require('child_process');

const RSCRIPT = 'Rscript';

const defaultOptions = {
    verboseResult: false
}

function parseStdout(output) {
    try {
        output = output.substr(output.indexOf('"{'), output.lastIndexOf('}"'));
        return JSON.parse(JSON.parse(output));   
    } catch (err) {
        return err;
    }
}

function callAsync (script, args, options) {
    return new Promise((resolve, reject) => {
        const result = args ? 
            child_process.spawn(RSCRIPT, [script, JSON.stringify(args)])
            : child_process.spawn(RSCRIPT, [script]);

        const ret = {
            stdout: '',
            stderr: ''
        };
        result.stdout.on('data', (output) => {
            ret.stdout += output.toString();
        });
        result.stderr.on('data', (error) => {
            ret.stderr += error.toString();
        });
        result.on('close', (singal) => {
            if (singal == 0) {
                ret.stdout = parseStdout(ret.stdout);
                if (!(ret.stdout instanceof Error)) {
                    if (options.verboseResult) {
                        resolve({
                            pid: result.pid,
                            result: ret.stdout
                        });
                    } else {
                        resolve(ret.stdout);
                    };                     
                } else {
                    reject({
                        pid: result.pid,
                        error: ret.stdout.message
                    });                    
                }              
            } else if (singal == 1) {
                reject({
                    pid: result.pid,
                    error: ret.stderr
                });
                
            } else {
                reject({
                    pid: result.pid,
                    error: ret.stdout
                });
            }
        });
    });
}

function call(script, args, options, callback) {
    if (options instanceof Function) {
        callback = options;
        options = undefined;
    }

    options = options || defaultOptions;

    if (callback) {
        callAsync(script, args, options)
            .then(result => {
                callback(null, result);
            })
            .catch(err => {
                callback(err);
            });
    } else {
        return callAsync(script, args, options);
    }
}

function callSync(script, args, options) {
    options = options || defaultOptions;

    const result = args ? 
                    child_process.spawnSync(RSCRIPT, [script, JSON.stringify(args)])
                    : child_process.spawnSync(RSCRIPT, [script]);

    if (result.status == 0) {
        const ret = parseStdout(result.stdout.toString());
        if (!(ret instanceof Error)) {            
            if (options.verboseResult) {
                return {
                    pid: result.pid,
                    result: ret
                };
            } else {
                return ret;
            };
        } else {
            return {
                pid: result.pid,
                error: ret.message
            };            
        }      
    } else if (result.status == 1) {
        return {
            pid: result.pid,
            error: result.stderr.toString()
        };
    } else {
        return {
            pid: result.pid,
            error: result.stdout.toString()
        };
    }                

}

module.exports.callSync = callSync;
module.exports.call = call;