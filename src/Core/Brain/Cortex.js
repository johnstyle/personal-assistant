'use strict';

const slugify = require('slugify');

module.exports = class Cortex {
    constructor(container) {
        this.container = container;
        this.container.Cortex = this;
    }
    start() {
        this.container.Prompt.success('Loading the Cortex component');
        return this;
    }
    processing(question) {
        const self = this;
        let tokens = self.tokenize(question);
        if (1 === tokens.length
            && 'non' === tokens[0]) {
            return false;
        }

        self.container.ActiveMemory.add(tokens);
        if ('undefined' !== typeof context
            && true === context.trainning) {
            tokens = self.tokenize(context.question);
            self.container.DeclarativeMemory.add(tokens, question);
        }
        self.container.Prompt.debug('tokens', tokens);
        let answer = self.container.DeclarativeMemory.find(tokens);
        if (answer) {
            return answer;
        }

        context = {
            trainning: false,
            question: question
        };
        if (!answer) {
            answer = 'Je ne comprends pas, apprends moi';
            context.trainning = true;
        }

    }
    tokenize(str) {
        const self = this;
        const words = str.replace(/["'\-]+/gi, ' ').split(/\s/);
        words.forEach(function(word, index, object) {
            if (1 >= word.length) {
                object.splice(index, 1);
                return;
            }
            object[index] = self.slugify(word);
        });
        return words;
    }
    slugify (str) {
        return slugify(str).toLowerCase();
    }
};
