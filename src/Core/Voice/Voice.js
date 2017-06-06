'use strict';

const cylon = require('cylon');

module.exports = class Voice {
    constructor(container) {
        this.container = container;
    }
    start() {
        console.log(this.container.clc.green('✔ Chargement du composant Voice'));
        const self = this;
        cylon.robot({
            connections: {
                speech: { adaptor: 'speech'}
            },
            devices: {
                voice: { driver: "speech", voice: self.container.settings.lang + "+f3", speed: 150 }
            },
            work: function(my) {
                self.container.events.on('say', function(sentence) {
                    my.voice.say(sentence);
                });
            }
        }).start();
    }
};
