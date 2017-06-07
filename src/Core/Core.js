'use strict';

const Container = require('./Container');
const Voice = require('./Voice/Voice');
const Conversation = require('./Voice/Conversation');
const ActiveMemory = require('./Memory/ActiveMemory');
const DeclarativeMemory = require('./Memory/DeclarativeMemory');
const Synapse = require('./Brain/Synapse');
const Neuron = require('./Brain/Neuron');

module.exports = class Core {
    constructor() {
        this.container = new Container();
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
        (new Conversation(this.container)).start();
    }
    run() {
        this.container.Events.on('conversation-ready', function(conversation) {
            conversation.question('Bonjour ' + this.container.settings.myName + ' !');
        });
        this.container.Events.emit('ready', this);
    }
};
