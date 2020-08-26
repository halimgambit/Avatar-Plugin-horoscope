exports.action = function (data, callback) {

    var url = 'https://www.horoscope.fr/horoscopes/horoscope_';
    var signeHoroscope = data.action.sentence;

    if (!signeHoroscope) {
    Avatar.speak("Je n'ai pas compris le signe astrologique que tu recherches.", data.client, function () {
    Avatar.Speech.end(data.client);
    });
}
    else {
    var tblCommand = {
    recherche: function () { searchHoroscope(url, signeHoroscope, data)
    },
    error: function () {
    Avatar.speak(data.action.error, data.client, function () {
    Avatar.Speech.end(data.client);
    });
}          
    };
    info("Horoscope command:", data.action.command.yellow, "From:", data.client.yellow);
    tblCommand[data.action.command]();
}
    callback();
}

    var searchHoroscope = function (url, signeHoroscope, data) {
    var valHor = url + signeHoroscope + '.html',
    request = require('request'),
    cheerio = require('cheerio');
    request(valHor, function (error, response, body) {
    if (!error) {
    var $ = cheerio.load(body, { xmlMode: true, ignoreWhitespace: false, lowerCaseTags: false });
    var horoscope = $('div.text-wrapper:nth-child(1) > p:nth-child(3)').text();
    Avatar.speak('Horoscope pour le signe ' + signeHoroscope + ". " + horoscope, data.client, function(){ 
    Avatar.Speech.end(data.client);
    });
}
    else {
    Avatar.Speech.end(data.client);
}
    });
}