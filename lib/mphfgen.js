#!/usr/bin/env node
var cli = require('cli');
var fs = require('fs');
var logger = require('./logger');

(function main(){
    getInstalledLanguages()
        .then(setupHelp)
        .then(parseOptions)
        .then(openFile)
        .then(work)
        .catch(showError);

    function getInstalledLanguages() {
        var languages = fs.readdirSync(__dirname + '/langs');
        return Promise.resolve(languages);
    }

    function setupHelp(languages) {
        cli.enable('help', 'status', 'version');
        cli.setApp('mphfgen', '0.0.1');
        cli.parse(
            {
                language: ['l', 'Language to target', languages, 'c'],
                hashfunc: ['a', 'Hash function to use', ['djb2', 'sdbm'], 'djb2'],
            },
            [
                'generate',
            ]);
    }

    function parseOptions() {
        return new Promise(promiseCallback);
        
        function promiseCallback(resolve, reject) {
            cli.main(function(args, options) {
                if (1 === args.length) {
                    return resolve(args[0]);
                } else if (args.length > 1) {
                    return reject(new Error('only one input file can be specified'));
                } else {
                    return resolve();
                }
            });
        }
    }

    function openFile(filename) {
        if (filename === void 0) {
            logger.debug('using stdin');
            return new Promise(stdinPromiseCallback);
        } else {
            logger.debug('using input file "%s"', filename);
            return new Promise(filePromiseCallback);
        }

        function stdinPromiseCallback(resolve, reject) {
            cli.withStdin(function(data) {
                return resolve(data);
            });
        }

        function filePromiseCallback(resolve, reject) {
            fs.readFile(filename, function(err, buffer) {
                if (err) {
                    return reject(err);
                } else {
                    return resolve(buffer.toString());
                }
            });
        }
    }

    function work(contents) {
    }

    function showError(err) {
        logger.error(err.message);
    }
})();
