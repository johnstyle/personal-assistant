const slugify = require('slugify');

const events = require('./events');
const debug = require('./debug');

const classifier = {
    service: null,
    tokenize: function (str) {
        const self = this;
        const words = str.replace(/["']+/gi, ' ').split(/\s/);
        words.forEach(function(word, index, object) {
            object[index] = self.slugify(word);
        });
        return words;
    },
    slugify: function (str) {
        return slugify(str).toLowerCase();
    },
    classify: function (str) {
        const self = this;
        const documents = {};
        const tokens = this.tokenize(str);
        tokens.forEach(function(token, index, object) {
            if (1 >= token.length) {
                object.splice(index, 1);
            }
        });
        debug('tokens', tokens);
        tokens.forEach(function(token) {
            if ('undefined' !== typeof self.service.documents[token]) {
                Object.keys(self.service.documents[token]).forEach(function (documentIndex) {
                    const document = Object.assign({}, self.service.documents[token][documentIndex]);
                    if ('service' === document.type) {
                        document.service = self.service.services[document.service];
                    }
                    if ('undefined' === typeof documents[document.category]) {
                        documents[document.category] = [];
                    }
                    documents[document.category].push(document);
                });
                return;
            }
            if ('undefined' === typeof documents.undefined) {
                documents.undefined = [];
            }
            documents.undefined.push({
                type: 'undefined',
                token: token,
                name: null,
                category: null,
                service: null,
                action: null,
                value: null
            });
        });
        return documents;
    }
};

module.exports = classifier;