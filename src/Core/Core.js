'use strict';

const Container = require('./Container');
const Voice = require('./Voice/Voice');
const ActiveMemory = require('./Memory/ActiveMemory');
const DeclarativeMemory = require('./Memory/DeclarativeMemory');
const Synapse = require('./Brain/Synapse');
const Neuron = require('./Brain/Neuron');

module.exports = class Core {
    constructor() {
        this.container = new Container();
        console.log(this.container.clc.green('----------------------------------'));
        console.log(this.container.clc.green('Lancement de l\'assistant'));
        console.log(this.container.clc.green('----------------------------------'));
    }
    startMemory() {
        (new ActiveMemory(this.container)).start();
        (new DeclarativeMemory(this.container)).start();
    }
    startBrain() {
        (new Neuron(this.container)).start();
        (new Synapse(this.container)).start();
    }
    startVoice() {
        (new Voice(this.container)).start();
    }
};
