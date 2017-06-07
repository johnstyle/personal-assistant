'use strict';

const clc = require('cli-color');
const settings = require('./../../settings');
const Events = require('./Events');
const Prompt = require('./Voice/Prompt');

module.exports = class Container {
    constructor() {
        this.settings = settings;
        this.clc = clc;
        this.Events = (new Events(this)).start();
        this.Prompt = (new Prompt(this)).start();
    }
};
