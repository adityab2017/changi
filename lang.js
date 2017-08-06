var builder     = require('botbuilder'),
    utils       = require('./utils'),
    translator  = require('mstranslator');

//Setup Translator
var client = new translator({
                                api_key: process.env.MICROSOFT_TRANSLATOR_KEY // use this for the new token API. 
                            }, true);
//Standard Replies
var standardReplies = utils.stdResponse;

module.exports = [
    function (session) {
        var lang = session.userData['Lang'];
        if (!lang) {
            builder.Prompts.choice(session, standardReplies.firstInit, "Chinese|Japanese|Tamil|Hindi|Continue in English|Cancel");
        }
        else {
            session.endDialog();
        }
    },
    function (session, results) {
        session.sendTyping();
        if (results.response && results.response.entity !== 'Cancel') {
            var fullLang = "English";
            //Add more languages for your liking, add prompt on top also
            if (results.response.entity.toUpperCase() == "CHINESE") {
                session.userData['Lang'] = 'zh-chs';
                fullLang = "中文";
            } else if (results.response.entity.toUpperCase() == "JAPANESE") {
                session.userData['Lang'] = 'ja';
                fullLang = "日本語";
            } else if (results.response.entity.toUpperCase() == "TAMIL") {
                session.userData['Lang'] = 'ta';
                fullLang = "தமிழ்";
            } else if (results.response.entity.toUpperCase() == "HINDI") {
                session.userData['Lang'] = 'hi';
                fullLang = "हिन्दी";
            } else {
                session.userData['Lang'] = 'en';
                fullLang = "English";
            } 

            var paramsTranslateTo = {
                text: standardReplies.langChanged,
                from: 'en',
                to: session.userData['Lang']
            };

            client.translate(paramsTranslateTo, function (err, data) {
                session.endDialog(data + "(" + fullLang + ")");
            });
        } else {
            session.endDialog(standardReplies.notReady);
        }
    }
];