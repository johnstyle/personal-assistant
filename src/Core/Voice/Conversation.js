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
        self.container.Prompt.success('Loading the Conversation component');
        self.container.Events.on('ready', function() {
            self.container.Events.emit('conversation-ready', self);
        });
        return self;
    }
    question(text) {
        const self = this;
        let prompt = '> ';
        if ('undefined' !== typeof text) {
            self.container.Events.emit('say', [text]);
            prompt = self.container.clc.blue(text) + "\n> ";
        }
        self.readline.question(prompt, function (question) {
            self.answer(question);
        });
    }
    answer(question) {
        const self = this;
        let answer = self.container.Cortex.processing(question);
        self.container.Events.emit('say', answer);
        console.log(self.container.clc.blue(answer));
        self.question();
    }
};
