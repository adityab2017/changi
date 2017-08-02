//http://www.asherworldturns.com/wp-content/uploads/2013/11/IMG_7144.jpg

// JavaScript source code//Image Landmark Caption
var builder = require('botbuilder');
var validUrl = require('valid-url');
var utils = require('./utils');
var landmarkIdentify = require('./landmark_identify');
var standardReplies = utils.stdResponse;
var translator = require('mstranslator');
var needle = require('needle');


//Setup Translator
var client = new translator({
    api_key: process.env.MICROSOFT_TRANSLATOR_KEY // use this for the new token API. 
}, true);

module.exports = [
    function (session) {
        if (utils.hasImageAttachment(session)) {
            var stream = getImageStreamFromMessage(session.message);
            landmarkIdentify
                .getCaptionFromStream(stream)
                .then(function (caption) { utils.handleSuccessResponse(session, caption);})
                .catch(function (error) { utils.handleErrorResponse(session, error); });
        }
        else if (utils.parseAnchorTag(session.message.text) || (validUrl.isUri(session.message.text) ? session.message.text : null)) {
            var imageUrl = utils.parseAnchorTag(session.message.text) || (validUrl.isUri(session.message.text) ? session.message.text : null);
            if (imageUrl) {
                landmarkIdentify
                    .getCaptionFromUrl(imageUrl)
                    .then(function (caption) { utils.handleSuccessResponse(session, caption); })
                    .catch(function (error) { utils.handleErrorResponse(session, error); });
            }
        }
        else if (session.message.text == 'exit') {
            if (session.userData['Lang']) {
                var paramsTranslate = {
                    text: standardReplies.headBack,
                    from: 'en',
                    to: session.userData['Lang']
                };
                client.translate(paramsTranslate, function (err, dataTranslate) {
                    session.endDialog(dataTranslate);
                })
            } else {
                session.endDialog(standardReplies.headBack);
            };
        }

        else {
            if (session.userData['Lang']) {
                var paramsTranslate = {
                    text: standardReplies.imageUpload,
                    from: 'en',
                    to: session.userData['Lang']
                };
                client.translate(paramsTranslate, function (err, dataDefault) {
                    session.send(dataDefault);
                })
            } else {
                session.send(standardReplies.imageUpload);
            };
        }
    }
];

//Inline utilities
//Get image from input
function getImageStreamFromMessage(message) {
    var headers = {};
    var attachment = message.attachments[0];
    if (utils.checkRequiresToken(message)) {
        // The Skype attachment URLs are secured by JwtToken,
        // you should set the JwtToken of your bot as the authorization header for the GET request your bot initiates to fetch the image.
        // https://github.com/Microsoft/BotBuilder/issues/662
        connector.getAccessToken(function (error, token) {
            var tok = token;
            headers['Authorization'] = 'Bearer ' + token;
            headers['Content-Type'] = 'application/octet-stream';

            return needle.get(attachment.contentUrl, { headers: headers });
        });
    }

    headers['Content-Type'] = attachment.contentType;
    return needle.get(attachment.contentUrl, { headers: headers });
}