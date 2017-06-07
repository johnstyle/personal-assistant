'use strict';

module.exports = class Neuron {
    constructor(container) {
        this.container = container;
    }
    start() {
        this.container.Prompt.success('Chargement du composant Neuron');
        return this;
    }
};
