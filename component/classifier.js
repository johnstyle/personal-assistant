var fs = require('fs');
var slugify = require('slugify');

var settings = require('./../settings');

module.exports = {
    data: {
        services: {},
        documents: {}
    },
    load: function (callback) {
        var self = this;
        fs.access(settings.classifierFile, fs.constants.R_OK | fs.constants.W_OK, function (err) {
            if (!err) {
                self.data = JSON.parse(fs.readFileSync(settings.classifierFile, settings.charset));
            }
            callback();
        });
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
        for (var documentIndex in documents) {
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
        for (var serviceIndex in services) {
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
        var words = str.replace(/["']+/gi, ' ').split(/\s/);
        for (var wordIndex in words) {
            if (!words.hasOwnProperty(wordIndex)) {
                continue;
            }
            words[wordIndex] = this.slugify(words[wordIndex]);
        }
        for (var wordIndex in words) {
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
        var classifier = {
            service: null,
            documents: {}
        };
        var tokens = this.tokenize(str);
        for (var tokenIndex in tokens) {
            if (!tokens.hasOwnProperty(tokenIndex)) {
                continue;
            }
            var token = tokens[tokenIndex];
            for (var serviceIndex in this.data.services) {
                if (!this.data.services.hasOwnProperty(serviceIndex)) {
                    continue;
                }
                if (token in this.data.services[serviceIndex]) {
                    classifier.service = serviceIndex;
                }
            }
            for (var documentIndex in this.data.documents) {
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
