const fs = require('fs');
const slugify = require('slugify');

const settings = require('./../settings');
const events = require('./events');
const debug = require('./debug');

const classifier = {
    data: {
        services: {},
        documents: {}
    },
    addData: function (type, category, data) {
        if ('undefined' === typeof this.data[type][category]) {
            this.data[type][category] = {};
        }
        if ('object' !== typeof data) {
            data = {
                name: data,
            };
        }
        data = Object.assign({
            name: null,
            action: null,
            value: null
        }, data);
        this.data[type][category][this.slugify(data.name)] = data;
    },
    addDocument: function (category, document) {
        this.addData('documents', category, document);
    },
    addDocuments: function (category, documents) {
        for (const documentIndex in documents) {
            if (!documents.hasOwnProperty(documentIndex)) {
                continue;
            }
            this.addDocument(category, documents[documentIndex]);
        }
    },
    addService: function (category, service) {
        this.addData('services', category, service);
    },
    addServices: function (category, services) {
        for (const serviceIndex in services) {
            if (!services.hasOwnProperty(serviceIndex)) {
                continue;
            }
            this.addService(category, services[serviceIndex]);
        }
    },
    save: function () {
        fs.writeFile(settings.classifierFile, JSON.stringify(this.data), settings.charset);
    },
    tokenize: function (str) {
        const words = str.replace(/["']+/gi, ' ').split(/\s/);
        for (const wordIndex in words) {
            if (!words.hasOwnProperty(wordIndex)) {
                continue;
            }
            words[wordIndex] = this.slugify(words[wordIndex]);
        }
        return words;
    },
    slugify: function (str) {
        return slugify(str).toLowerCase();
    },
    classify: function (str) {
        const self = this;
        const classifier = {
            services: {},
            documents: {},
            words: []
        };
        const tokens = this.tokenize(str);
        tokens.forEach(function(token, index, object) {
            if (1 >= token.length) {
                object.splice(index, 1);
            }
        });
        debug('tokens', tokens);
        tokens.forEach(function(token) {
            let find = false;
            Object.keys(self.data.services).forEach(function(category) {
                const services = self.data.services[category];
                if (token in services) {
                    if ('undefined' === typeof classifier.services[category]) {
                        classifier.services[category] = [];
                    }
                    classifier.services[category].push(services[token]);
                    find = true;
                }
            });
            if (find) {
                return;
            }
            Object.keys(self.data.documents).forEach(function(category) {
                const documents = self.data.documents[category];
                if (token in documents) {
                    if ('undefined' === typeof classifier.documents[category]) {
                        classifier.documents[category] = [];
                    }
                    classifier.documents[category].push(documents[token]);
                    find = true;
                }
            });
            if (find) {
                return;
            }
            if (3 >= token.length) {
                return;
            }
            classifier.words.push(token);
        });
        return classifier;
    }
};

fs.access(settings.classifierFile, fs.constants.R_OK | fs.constants.W_OK, function (err) {
    if (!err) {
        classifier.data = JSON.parse(fs.readFileSync(settings.classifierFile, settings.charset));
    }
    events.emit('classifier-ready', classifier);
});
