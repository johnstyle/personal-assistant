const glob = require('glob');
const fs = require('fs');
const yaml = require('js-yaml');
const clc = require('cli-color');

const settings = require('./settings');
const events = require('./component/events');

require('./component/run');

events.on('classifier-ready', function(classifier) {

    console.log(clc.green('✔ Chargement de la base de donnée'));

    glob(settings.dictionaryDirectory + '/*.yml', function (er, files) {
        files.forEach(function(file) {
            const data = yaml.safeLoad(fs.readFileSync(file, settings.charset));
            classifier.service.addDictionary(data);
            console.log(clc.green('✔ Dictionary ' + data.name + ' added to ' + data.category));
        });
        classifier.service.save();
    });

    glob(settings.servicesDirectory + '/*/*.yml', function (er, files) {
        files.forEach(function(file) {
            const data = yaml.safeLoad(fs.readFileSync(file, settings.charset));
            classifier.service.addService(data);
            console.log(clc.green('✔ Service ' + data.name + ' added to ' + data.category));
        });
        classifier.service.save();
    });
});
