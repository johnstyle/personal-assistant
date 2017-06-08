'use strict';

module.exports = class Synapse {
    constructor(container) {
        this.container = container;
        this.container.Synapse = this;
    }
    start() {
        this.container.Prompt.success('Loading the Synapse component');
        return this;
    }
};
