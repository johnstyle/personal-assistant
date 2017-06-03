const fs = require('fs');
const slugify = require('slugify');

const settings = require('./../settings');
const events = require('./events');

const classifier = {
    data: {
        services: {},
        documents: {}
    },
    addDocument: function (category, document) {
        if ('undefined' === typeof this.data.documents[category]) {
            this.data.documents[category] = {};
        }
        if ('object' !== typeof document) {
            document = {
                name: document,
                type: null,
                value: null
            };
        }
        this.data.documents[category][this.slugify(document.name)] = document;
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
        if ('undefined' === typeof this.data.services[category]) {
            this.data.services[category] = {};
        }
        this.data.services[category][this.slugify(service)] = service;
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
        for (const wordIndex in words) {
            if (!words.hasOwnProperty(wordIndex)) {
                continue;
            }
            if (2 >= words[wordIndex].length) {
                words.splice(wordIndex, 1);
            }
        }
        return words;
    },
    slugify: function (str) {
        return slugify(str).toLowerCase();
    },
    classify: function (str) {
        const classifier = {
            service: null,
            documents: {}
        };
        const tokens = this.tokenize(str);
        for (const tokenIndex in tokens) {
            if (!tokens.hasOwnProperty(tokenIndex)) {
                continue;
            }
            const token = tokens[tokenIndex];
            for (const serviceIndex in this.data.services) {
                if (!this.data.services.hasOwnProperty(serviceIndex)) {
                    continue;
                }
                if (token in this.data.services[serviceIndex]) {
                    classifier.service = serviceIndex;
                }
            }
            for (const documentIndex in this.data.documents) {
                if (!this.data.documents.hasOwnProperty(documentIndex)) {
                    continue;
                }
                if (token in this.data.documents[documentIndex]) {
                    if ('undefined' === typeof classifier.documents[documentIndex]) {
                        classifier.documents[documentIndex] = [];
                    }
                    classifier.documents[documentIndex].push(this.data.documents[documentIndex][token]);
                }
            }
        }
        return classifier;
    }
};

fs.access(settings.classifierFile, fs.constants.R_OK | fs.constants.W_OK, function (err) {
    if (!err) {
        classifier.data = JSON.parse(fs.readFileSync(settings.classifierFile, settings.charset));
    }
    events.emit('classifier', classifier);
});
