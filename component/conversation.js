const clc = require('cli-color');
const readline = require('readline');
const objectAssign = require('deep-assign');

const events = require('./events');
const debug = require('./debug');
const settings = require('./../settings');

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
            const documents = objectAssign({}, context, self.classifier.classify(answer));
            debug('documents', documents);
            let findService = false;
            Object.keys(documents).forEach(function(category) {
                documents[category].forEach(function(document) {
                    if ('service' === document.type) {
                        self.service(document.service.name, document, documents);
                        findService = true;
                    }
                });
            });
            if (!findService) {
                self.service('default', {}, documents);
            }
        });
    },
    service: function (name, service, documents) {
        const self = this;
        require('.' + settings.servicesDirectory + '/' + name + '/' + name)(service, documents, function (sentences, context) {
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
