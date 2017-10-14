'use strict'

const child_process = require('child_process');

const RSCRIPT = 'Rscript';

const defaultOptions = {
    verboseResult: false
}

function parseStdout(output) {
    try {
        output = output.toString();
        output = output.substr(output.indexOf('"{'), output.lastIndexOf('}"'));
        return JSON.parse(JSON.parse(output.toString()));    
    } catch (err) {
        return new Error(err);
    }
}

function callAsync (script, args, options) {
    return new Promise((resolve, reject) => {
        const result = args ? 
            child_process.spawn(RSCRIPT, [script, JSON.stringify(args)])
            : child_process.spawn(RSCRIPT, [script]);

        const ret = {};
        result.stdout.on('data', (output) => {
            ret.stdout = parseStdout(output);
        });
        result.stderr.on('data', (error) => {
            ret.stderr = new Error(error.toString());
        });
        result.on('exit', (singal) => {
            // console.log('singal = ', singal);
            if (singal == 0) {
                if (!(ret.out instanceof Error)) {
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
                        error: ret.stdout
                    });                    
                }              
            } else {
                reject({
                    pid: result.pid,
                    error: ret.stderr
                });
            }
        });
    });
}

function call(script, args, options, callback) {
    options = options | defaultOptions;

    if (callback) {
        callAsync(script, args, options)
            .then(result => {
                callback(result);
            })
            .catch(err => {
                callback(err);
            });
    } else {
        return callAsync(script, args, options);
    }
}

function callSync(script, args, options) {
    options = options | defaultOptions;

    const result = args ? 
                    child_process.spawnSync(RSCRIPT, [script, JSON.stringify(args)])
                    : child_process.spawnSync(RSCRIPT, [script]);

    if (result.status != 0) {
        return {
            pid: result.pid,
            error: new Error(result.stdout.toString())
        }        
    } else if (result.stdout) {
        const ret = parseStdout(result.stdout);
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
                error: ret
            };            
        }
    } else if (result.stderr) {
        return {
            pid: result.pid,
            error: new Error(result.stderr.toString())
        };
    } else if (result.signal) {
        return {
            pid: result.pid,
            error: new Error('killed with ', result.signal)
        };
    } else {
        return {
            pid: result.pid,
            error: new Error('unknown')
        };
    }
}

module.exports.callSync = callSync;
module.exports.call = call;