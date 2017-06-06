'use strict';

module.exports = class ActiveMemory {
    constructor(container) {
        this.container = container;
    }
    start() {
        console.log(this.container.clc.green('✔ Chargement du composant ActiveMemory'));
    }
};
