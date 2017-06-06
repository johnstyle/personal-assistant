'use strict';

module.exports = class DeclarativeMemory {
    constructor(container) {
        this.container = container;
    }
    start() {
        console.log(this.container.clc.green('✔ Chargement du composant DeclarativeMemory'));

    }
};
