'use strict';

module.exports = class ActiveMemory {
    constructor(container) {
        this.container = container;
    }
    start() {
        this.container.Prompt.success('Chargement du composant ActiveMemory');
        return this;
    }
};
