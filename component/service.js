const fs = require('fs');

const settings = require('./../settings');

const service = {
    classifier: null,
    services: {},
    documents: {},
    addService: function (data) {
        const self = this;
        self.services[data.name] = data;
        data.documents.forEach(function(document) {
            self.addDocument('service', data.name, self.prepare(document, {
                service: data.name,
                category: data.category,
            }));
        });
    },
    addDictionary: function (data) {
        const self = this;
        data.documents.forEach(function(document) {
            self.addDocument('dictionary', data.name, self.prepare(document, {
                category: data.category,
            }));
        });
    },
    addDocument: function (type, name, data) {
        const self = this;
        if ('undefined' === typeof self.documents[data.token]) {
            self.documents[data.token] = {};
        }
        data.type = type;
        self.documents[data.token][name] = data;
    },
    prepare: function (data, defaultData) {
        const self = this;
        if ('object' !== typeof data) {
            data = {
                name: data,
            };
        }
        if ('object' !== typeof defaultData) {
            defaultData = {};
        }
        data = Object.assign({
            type: 'undefined',
            token: self.classifier.slugify(data.name),
            name: null,
            category: null,
            service: null,
            action: null,
            value: null
        }, Object.assign(defaultData, data));
        return data;
    },
    save: function () {
        const self = this;
        fs.writeFile(settings.classifierFile, JSON.stringify({
            services: self.services,
            documents: self.documents,
        }), settings.charset);
    },
};

module.exports = function (classifier, services, documents) {
    service.classifier = classifier;
    service.services = services;
    service.documents = documents;
    return service;
};
