const cylon = require('cylon');
const events = require('./events');
const settings = require('./../settings');

cylon.robot({
    connections: {
        speech: { adaptor: 'speech'}
    },
    devices: {
        voice: { driver: "speech", voice: settings.lang + "+f3", speed: 150 }
    },
    work: function(my) {
        events.on('say', function(sentence) {
            my.voice.say(sentence);
        });
    }
}).start();
