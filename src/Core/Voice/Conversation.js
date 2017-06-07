const readline = require('readline');
const objectAssign = require('deep-assign');

module.exports = class Conversation {
    constructor(container) {
        this.container = container;
        this.readline = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }
    start() {
        const self = this;
        self.container.Prompt.success('Chargement du composant Conversation');
        self.container.Events.on('ready', function() {
            self.container.Events.emit('conversation-ready', self);
        });
        return this;
    }
    question(text, context) {
        const self = this;
        let prompt = '> ';
        if ('undefined' !== typeof text) {
            self.container.Events.emit('say', [text]);
            prompt = this.container.clc.blue(text) + "\n> ";
        }
        if ('undefined' === typeof context) {
            context = {};
        }
        self.readline.question(prompt, function (answer) {
            const documents = objectAssign({}, context, self.classifier.classify(answer));
            this.container.debug.log('documents', documents);
            let findService = false;
            Object.keys(documents).forEach(function(category) {
                documents[category].forEach(function(document) {
                    if ('service' === document.type) {
                        self.answer(document.service.name, document, documents);
                        findService = true;
                    }
                });
            });
            if (!findService) {
                self.answer('default', {}, documents);
            }
        });
    }
    answer(name, service, documents) {
        const self = this;
        require('.' + settings.servicesDirectory + '/' + name + '/' + name)(service, documents, function (sentences, context) {
            sentences.forEach(function(sentence) {
                self.container.Events.emit('say', sentence);
                console.log(this.container.clc.blue(sentence));
            });
            self.question(undefined, context);
        });
    }
};
