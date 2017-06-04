const weather = require('openweather-apis');
const settings = require('./../../settings');

weather.setLang(settings.lang);
weather.setUnits(settings.services.weather.units);
weather.setAPPID(settings.services.weather.key);

module.exports = function (service, documents, words, callback) {

    if ('undefined' === typeof documents.location) {
        callback(['De quelle localité ?'], {
            services: {weather: [service]},
            documents: documents,
            words: words
        });
        return;
    }

    documents.location.forEach(function(location) {
        weather.setCity(location.name);
        const day = 1;
        weather.getWeatherForecastForDays(day, function(err, obj){
            if (err) {
                console.log(err);
                return;
            }
            const sentences = [];
            obj.list.forEach(function(item) {
                sentences.push("Il fera " + item.temp.day + "° avec " + item.weather[0].description);
            });
            callback(sentences);
        });
    });
};
