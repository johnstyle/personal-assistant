const weather = require('openweather-apis');
const moment = require('moment');
const settings = require('./../../settings');

weather.setLang(settings.services.weather.lang);
weather.setUnits(settings.services.weather.units);
weather.setAPPID(settings.services.weather.key);

module.exports = function (documents, callback) {

    if ('undefined' === typeof documents.location) {
        console.log('Veuillez renseigner une localisation');
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
