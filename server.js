const clc = require('cli-color');

const settings = require('./settings');
const events = require('./component/events');
const debug = require('./component/debug');

console.log(clc.green('----------------------------------'));
console.log(clc.green('✔ Lancement de l\'assistant'));

require('./component/say');
require('./component/classifier');

events.on('classifier-ready', function(classifier) {
    console.log(clc.green('✔ Chargement de la base de donnée'));
    console.log(clc.green('✔ Chargement du module de conversation'));
    console.log(clc.green('----------------------------------'));
    require('./component/conversation')(classifier);
});

events.on('conversation-ready', function(conversation) {
    conversation.question('Bonjour ' + settings.myName + ' !');
});
