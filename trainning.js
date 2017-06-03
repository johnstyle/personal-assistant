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

        for (const fileIndex in files) {
            if (!files.hasOwnProperty(fileIndex)) {
                continue;
            }
            const file = files[fileIndex];
            const data = yaml.safeLoad(fs.readFileSync(file, settings.charset));
            for (const category in data) {
                if (!data.hasOwnProperty(category)) {
                    continue;
                }
                const documents = data[category];
                classifier.addDocuments(category, documents);
                console.log(clc.green('✔ ' + documents.length + ' document(s) added to ' + category));
            }
        }

        classifier.save();
    });

    glob(settings.trainningDirectory + '/services/*.yml', function (er, files) {

        for (const fileIndex in files) {
            if (!files.hasOwnProperty(fileIndex)) {
                continue;
            }
            const file = files[fileIndex];
            const data = yaml.safeLoad(fs.readFileSync(file, settings.charset));
            for (const category in data) {
                if (!data.hasOwnProperty(category)) {
                    continue;
                }
                const services = data[category];
                classifier.addServices(category, services);
                console.log(clc.green('✔ ' + services.length + ' service(s) added to ' + category));
            }
        }

        classifier.save();
    });
});
