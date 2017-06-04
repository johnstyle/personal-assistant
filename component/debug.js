const clc = require('cli-color');
const util = require('util');
const args = require( 'argv' ).option({
    name: 'debug',
    type: 'boolean'
}).run();

module.exports = function (message, data) {
    if (args.options.debug) {
        console.log(clc.yellow('[Debug] ' + message + ' : ' + util.inspect(data)));
    }
};
