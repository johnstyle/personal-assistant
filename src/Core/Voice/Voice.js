'use strict';

const cylon = require('cylon');

module.exports = class Voice {
    constructor(container) {
        this.container = container;
    }
    start() {
        const self = this;
        self.container.Prompt.success('Chargement du composant Voice');
        cylon.robot({
            connections: {
                speech: { adaptor: 'speech'}
            },
            devices: {
                voice: { driver: "speech", voice: self.container.settings.lang + "+f3", speed: 150 }
            },
            work: function(my) {
                self.container.Events.on('say', function(sentence) {
                    my.voice.say(sentence);
                });
            }
        }).start();
        return this;
    }
};
