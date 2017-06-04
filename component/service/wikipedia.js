const request = require('request');
const querystring = require('querystring');
const settings = require('./../../settings');

module.exports = function (service, documents, words, say) {

    if (!words.length) {
        say(['Que voulez-vous savoir ?']);
        return;
    }

    const baseUrl = 'https://' + settings.lang + '.wikipedia.org/w/api.php?';

    request.get({
        url: baseUrl + querystring.stringify({
            action: 'query',
            list: 'search',
            srwhat: 'text',
            srsearch: words.join(' '),
            format: 'json'
        }),
        json: true,
    }, function(err, res, data){
        if (err) {
            console.log('Error:', err);
        } else if (res.statusCode !== 200) {
            console.log('Status:', res.statusCode);
        } else {

            request.get({
                url: baseUrl + querystring.stringify({
                    action: 'query',
                    prop: 'extracts',
                    exintro: null,
                    explaintext: null,
                    redirects: true,
                    titles: data.query.search[0].title,
                    format: 'json'
                }),
                json: true,
            }, function(err, res, data){
                if (err) {
                    console.log('Error:', err);
                } else if (res.statusCode !== 200) {
                    console.log('Status:', res.statusCode);
                } else {
                    say([data.query.pages[Object.keys(data.query.pages)[0]].extract]);
                }
            });
        }
    });
};
