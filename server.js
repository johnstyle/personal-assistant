var natural = require('natural');
var readline = require('readline');
var clc = require('cli-color');

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

var fileDatabase = './data/classifier.json';
var classifier;

natural.BayesClassifier.load(fileDatabase, null, function(err, fileClassifier) {

    classifier = fileClassifier;

    if ('undefined' === typeof classifier) {
        classifier = new natural.BayesClassifier();
    }

    question('Bonjour !');
});

function question(text) {
    rl.question(clc.blue(text) + "\n", function (answer) {
        try {
            question(say(classifier.classify(answer)), true);
        } catch (e) {
            console.log(clc.red('[DEBUG] training'));
            training(answer);
        }
    });
}

function training(answer) {
    rl.question(clc.yellow('Je n\'ai pas compris la question, entrainement : '), function (action) {
        console.log(clc.red('[DEBUG] addDocument ' + action));
        classifier.addDocument(answer, action);
        classifier.train();
        classifier.save(fileDatabase, function(err, classifier) {});
        question(say(action));
    });
}

function say(action) {
    console.log(clc.red('[DEBUG] classify ' + action));
    return (new Date()).toLocaleDateString();
    //return require('./plugins/' + action)();
}
