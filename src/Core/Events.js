'use strict';

module.exports = class Events extends require('events') {
    constructor(container) {
        super();
        this.container = container;
    }
    start() {
        return this;
    }
};
