'use strict';

module.exports = class Neuron {
    constructor(container) {
        this.container = container;
        this.container.Neuron = this;
    }
    start() {
        this.container.Prompt.success('Loading the Neuron component');
        return this;
    }
};
