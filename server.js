const readline = require('readline');
const clc = require('cli-color');
const util = require('util');

const settings = require('./settings');
const events = require('./component/events');

require('./component/say');
require('./component/classifier');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

events.on('classifier', function(classifier) {
    console.log(clc.green('✔ Chargement de la base de donnée'));
    question(classifier);
});

function question(classifier) {
    rl.question(clc.blue('Quelle est votre question ?') + "\n", function (answer) {
        const result = classifier.classify(answer);
        if (!result.service) {
            return;
        }
        require('./component/service/' + result.service)(result.documents, function (sentences) {
            sentences.forEach(function(sentence) {
                events.emit('say', sentence);
                console.log(clc.blue(sentence));
            });
            question(classifier);
        });
    });
}