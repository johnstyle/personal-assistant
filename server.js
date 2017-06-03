var readline = require('readline');
var clc = require('cli-color');
var util = require('util')

var settings = require('./settings');
var classifier = require('./component/classifier');

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

classifier.load(function () {
    question();
});

function question() {
    rl.question(clc.blue("Quelle est votre question ?") + "\n", function (answer) {
        var result = classifier.classify(answer);
        if (!result.service) {
            return;
        }
        console.log(util.inspect(result, {showHidden: false, depth: null}));
        //require('./component/service/' + result.service)(result.documents);
        question();
    });
}
