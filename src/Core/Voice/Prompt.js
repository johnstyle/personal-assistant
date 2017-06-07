const util = require('util');
const args = require( 'argv' ).option({
    name: 'debug',
    type: 'boolean'
}).run();

module.exports = class Prompt {
    constructor(container) {
        this.container = container;
    }
    start() {
        this.success('Chargement du composant Prompt');
        return this;
    }
    debug(message) {
        if (args.options.debug) {
            console.log(this.container.clc.yellow('[Debug] ' + message + ' : ' + util.inspect(data)));
        }
    }
    success(message) {
        console.log(this.container.clc.green('✔ ' + message));
    }
    say(message) {
        console.log(this.container.clc.blue(message));
    }
};