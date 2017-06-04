const glob = require('glob');
const fs = require('fs');
const yaml = require('js-yaml');
const clc = require('cli-color');

const settings = require('./settings');
const events = require('./component/events');

require('./component/classifier');

events.on('classifier', function(classifier) {

    console.log(clc.green('✔ Chargement de la base de donnée'));

    glob(settings.trainningDirectory + '/documents/*.yml', function (er, files) {
        files.forEach(function(file) {
            const data = yaml.safeLoad(fs.readFileSync(file, settings.charset));
            Object.keys(data).forEach(function(category) {
                const documents = data[category];
                classifier.addDocuments(category, documents);
                console.log(clc.green('✔ ' + documents.length + ' document(s) added to ' + category));
            });
        });
        classifier.save();
    });

    glob(settings.trainningDirectory + '/services/*.yml', function (er, files) {
        files.forEach(function(file) {
            const data = yaml.safeLoad(fs.readFileSync(file, settings.charset));
            Object.keys(data).forEach(function(category) {
                const services = data[category];
                classifier.addServices(category, services);
                console.log(clc.green('✔ ' + services.length + ' service(s) added to ' + category));
            });
        });
        classifier.save();
    });
});
