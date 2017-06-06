const weather = require('openweather-apis');
const settings = require('./../../../settings');

weather.setLang(settings.lang);
weather.setUnits(settings.services.weather.units);
weather.setAPPID(settings.services.weather.key);

module.exports = function (service, documents, say) {

    if ('undefined' === typeof documents.location) {
        say(['De quelle localité ?'], documents);
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
            say(sentences);
        });
    });
};
