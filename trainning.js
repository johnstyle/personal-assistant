var glob = require('glob');
var fs = require('fs');
var yaml = require('js-yaml');
var clc = require('cli-color');

var settings = require('./settings');
var classifier = require('./component/classifier');

classifier.load(function () {

    glob(settings.trainningDirectory + '/documents/*.yml', function (er, files) {

        for (var fileIndex in files) {
            if (!files.hasOwnProperty(fileIndex)) {
                continue;
            }
            var file = files[fileIndex];
            var data = yaml.safeLoad(fs.readFileSync(file, settings.charset));
            for (var category in data) {
                if (!data.hasOwnProperty(category)) {
                    continue;
                }
                var documents = data[category];
                classifier.addDocuments(category, documents);
                console.log(clc.green('✔ ' + documents.length + ' document(s) added to ' + category));
            }
        }

        classifier.save();
    });

    glob(settings.trainningDirectory + '/services/*.yml', function (er, files) {

        for (var fileIndex in files) {
            if (!files.hasOwnProperty(fileIndex)) {
                continue;
            }
            var file = files[fileIndex];
            var data = yaml.safeLoad(fs.readFileSync(file, settings.charset));
            for (var category in data) {
                if (!data.hasOwnProperty(category)) {
                    continue;
                }
                var services = data[category];
                classifier.addServices(category, services);
                console.log(clc.green('✔ ' + services.length + ' service(s) added to ' + category));
            }
        }

        classifier.save();
    });


});
