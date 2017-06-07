'use strict';

module.exports = class DeclarativeMemory {
    constructor(container) {
        this.container = container;
    }
    start() {
        this.container.Prompt.success('Chargement du composant DeclarativeMemory');
        return this;
    }
};
