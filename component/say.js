const Cylon = require('cylon');
const events = require('./events');

Cylon.robot({
    connections: {
        speech: { adaptor: 'speech'}
    },
    devices: {
        voice: {
            driver: 'speech',
            language: 'french',
            gender: 'f',
            variant: '4',
            speed: 120
        }
    },
    work: function(my) {
        events.on('say', function(sentence) {
            my.voice.say(sentence);
        });
    }
}).start();
