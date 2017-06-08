'use strict';

module.exports = class DeclarativeMemory {
    constructor(container) {
        this.container = container;
        this.container.DeclarativeMemory = this;
        this.declarativeMemory = [
            {tokens: [['comment', 'appels', 'tu']], answer: 'Toto'},
            {tokens: [['comment', 'vas', 'tu']], answer: 'Bien'},
            {tokens: [['quel', 'age', 'tu']], answer: '1an'},
        ];
    }
    start() {
        this.container.Prompt.success('Loading the DeclarativeMemory component');
        return this;
    }
    add(tokens, answer) {
        this.declarativeMemory.push({tokens: [tokens], answer: answer});
    }
    find(tokens) {
        const self = this;
        let memoryItems = [];
        self.container.Prompt.debug('', self.declarativeMemory[3]);

        self.declarativeMemory.forEach(function (memory) {
            memory.tokens.forEach(function (items) {
                let find = 0;
                items.forEach(function (token) {
                    if(tokens.includes(token)) {
                        find++;
                    }
                });
                const score = find / items.length;
                if (0 !== score) {
                    memoryItems.push({score: score, answer: memory.answer});
                }
            });
        });
        if (memoryItems.length) {
            memoryItems.sort(function (a, b) {
                return b.score - a.score;
            });
            this.container.Prompt.debug('', memoryItems);
            if(0.8 <= memoryItems[0].score) {
                return memoryItems[0].answer;
            }
        }
        return false;
    }
};
