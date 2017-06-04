const clc = require('cli-color');
const readline = require('readline');
const objectAssign = require('deep-assign');

const events = require('./events');
const debug = require('./debug');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const conversation = {
    classifier: null,
    question: function (text, context) {
        const self = this;
        let prompt = '> ';
        if ('undefined' !== typeof text) {
            events.emit('say', [text]);
            prompt = clc.blue(text) + "\n> ";
        }
        if ('undefined' === typeof context) {
            context = {};
        }
        rl.question(prompt, function (answer) {
            const result = objectAssign({}, context, self.classifier.classify(answer));
            debug('services', result.services);
            debug('documents', result.documents);
            debug('words', result.words);
            const serviceKeys = Object.keys(result.services);
            if (!serviceKeys.length) {
                self.service('default', {}, result.documents, result.words);
                return;
            }
            serviceKeys.forEach(function(name) {
                self.service(name, result.services[name], result.documents, result.words);
            });
        });
    },
    service: function (name, service, documents, words) {
        const self = this;
        require('./service/' + name)(service, documents, words, function (sentences, context) {
            sentences.forEach(function(sentence) {
                events.emit('say', sentence);
                console.log(clc.blue(sentence));
            });
            self.question(undefined, context);
        });
    }
};

module.exports = function (classifier) {
    conversation.classifier = classifier;
    events.emit('conversation-ready', conversation);
};
