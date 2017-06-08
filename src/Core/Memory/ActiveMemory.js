'use strict';

module.exports = class ActiveMemory {
    constructor(container) {
        this.container = container;
        this.container.ActiveMemory = this;
        this.memory = [];
        this.last = null;
    }
    start() {
        this.container.Prompt.success('Loading the ActiveMemory component');
        return this;
    }
    add(tokens) {
        this.last = tokens;
        this.memory.push(tokens);
    }
};
