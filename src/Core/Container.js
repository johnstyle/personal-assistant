'use strict';

const clc = require('cli-color');
const settings = require('./../../settings');
const Events = require('./Events');

module.exports = class Container {
    constructor() {
        this.settings = settings;
        this.events = new Events();
        this.clc = clc;
    }
};
