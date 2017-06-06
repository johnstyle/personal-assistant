'use strict';

module.exports = class Neuron {
    constructor(container) {
        this.container = container;
    }
    start() {
        console.log(this.container.clc.green('✔ Chargement du composant Neuron'));
    }
};
