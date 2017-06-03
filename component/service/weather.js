var weather = require('openweather-apis');
var moment = require('moment');
var settings = require('./../../settings');

weather.setLang(settings.services.weather.lang);
weather.setUnits(settings.services.weather.units);
weather.setAPPID(settings.services.weather.key);

module.exports = function (documents) {

    if ('undefined' === typeof documents.location) {
        console.log('Veuillez renseigner une localisation');
        return;
    }

    documents.location.forEach(function(location) {
        weather.setCity(location.name);
        var day = 1;
        weather.getWeatherForecastForDays(day, function(err, obj){
            if (err) {
                console.log(err);
                return;
            }
            obj.list.forEach(function(item) {
                console.log("Il fera " + item.temp.day + "° avec " + item.weather[0].description);
            });
        });
    });
};
