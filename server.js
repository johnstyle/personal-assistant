const readline = require('readline');
const clc = require('cli-color');
const util = require('util');
const args = require( 'argv' ).option({
    name: 'debug',
    type: 'boolean'
}).run();

const settings = require('./settings');
const events = require('./component/events');

console.log(clc.green('----------------------------------'));
console.log(clc.green('✔ Lancement de l\'assistant'));

require('./component/say');
require('./component/classifier');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

events.on('classifier', function(classifier) {
    console.log(clc.green('✔ Chargement de la base de donnée'));
    console.log(clc.green('----------------------------------'));
    question(classifier, 'Bonjour ' + settings.myName + ' !');
});

function question(classifier, text) {
    rl.question(('undefined' !== typeof text ? clc.blue(text) + "\n> " : '> '), function (answer) {
        const result = classifier.classify(answer);
        if (args.options.debug) {
            console.log(clc.yellow('[Debug] services : ' + util.inspect(result.services)));
            console.log(clc.yellow('[Debug] documents : ' + util.inspect(result.documents)));
        }
        let total = 0;
        Object.keys(result.services).forEach(function(name) {
            const service = result.services[name];
            require('./component/service/' + name)(service, result.documents, function (sentences) {
                sentences.forEach(function(sentence) {
                    events.emit('say', sentence);
                    console.log(clc.blue(sentence));
                });
                question(classifier);
            });
            total++;
        });
        if (!total) {
            question(classifier, 'Je ne comprend pas la question');
        }
    });
}
