const fs = require('fs');
const settings = require('./../settings');
const events = require('./events');

fs.access(settings.classifierFile, fs.constants.R_OK | fs.constants.W_OK, function (err) {
    let data = {
        services: {},
        documents: {}
    };
    const classifier = require('./classifier');
    if (!err) {
        data = JSON.parse(fs.readFileSync(settings.classifierFile, settings.charset));
    }
    classifier.service = require('./service')(classifier, data.services, data.documents);
    events.emit('classifier-ready', classifier);
});
