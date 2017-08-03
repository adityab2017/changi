require('dotenv-extended').load();
var translator = require('mstranslator');

//Setup Translator
var client = new translator({
    api_key: process.env.MICROSOFT_TRANSLATOR_KEY // use this for the new token API. 
}, true);

//Dialog labels
var dialogLabels = {
    Sims: 'Mobile SIM Cards',
    Travel: 'Public Transport Cards'
};

exports.choiceLabels = dialogLabels;

//Standard Responses
var stdResponse = {
    simnCard: "The following services can assist you during your stay:\n\n",
    firstInit: "This is your first time using me, which language do you prefer me to reply in?",
    langChanged: "Okay! Your language preference has been set. ",
    askQn: "To begin, just ask me a question like",
    queryExample: "\n\n- Scan this landmark\n\n- I have questions\n\n- Places to visit\n\n- Things to do",
    techLimitation: "Due to technical limitations, please send me your requests in English.",
    didNotUnderstand: "Sorry, I didn't understand what you said.",
    langReset: "Your preferences have been reset.",
    resetSuccess: "I've just reset myself, lets try again!",
    startCommand: "You seem to be new here\n\nYou may want to consider the following services:\n\nEg. ",
    notReady: "Okay! Talk to me when you are ready :)",
    configureLang: "Please configure your language first by saying 'Configure Language'",
    headBack: "Exiting selected functionality",
    imageUpload: "Can you share a picture?\n\n Try sending an image URL or upload an image\n\nYou can also 'exit' if you changed your mind!"
};

exports.stdResponse = stdResponse;

exports.hasImageAttachment = function (session) {
    return session.message.attachments.length > 0 &&
        session.message.attachments[0].contentType.indexOf('image') !== -1;
};

exports.checkRequiresToken = function (message) {
    return message.source === 'skype' || message.source === 'msteams';
};

/**
 * Gets the href value in an anchor element.
 * Skype transforms raw urls to html. Here we extract the href value from the url
 * @param {string} input Anchor Tag
 * @return {string} Url matched or null
 */
exports.parseAnchorTag = function (input) {
    var match = input.match('^<a href=\"([^\"]*)\">[^<]*</a>$');
    if (match && match[1]) {
        return match[1];
    }

    return null;
};

//=========================================================
// Response Handling
//=========================================================

var queryResponse = {
    successLandmark: "It\'s the ",
    failLandmark: "Couldn\'t identify this landmark",
    errorResp:"Oops! Something went wrong. Try again later."
};

exports.handleSuccessResponse = function (session, caption) {
    if (caption) {
        if (session.userData['Lang'] && session.userData['Lang'] !=='en') {
            var paramsTranslateSuccess = {
                text: queryResponse.successLandmark +' '+ caption ,
                from: 'en',
                to: session.userData['Lang']
            };
            client.translate(paramsTranslateSuccess, function (err, dataSuccess) {
                session.send(dataSuccess);
                session.endDialog(caption);
            })
        } else {
            session.send(queryResponse.successLandmark);
            if (caption = 'Marina Bay Sands'){
                session.send('<b>[Marina Bay Sands](https://en.wikipedia.org/wiki/Marina_Bay_Sands)</b> \n\n Marina Bay Sands is an integrated resort fronting Marina Bay in Singapore. At its opening in 2010, it was billed as the world\'s most expensive standalone casino property at S$8 billion, including the land cost.\n\n <i> Powered by [Bing](https://www.bing.com)</i>')
            }
            session.endDialog();
        };
    }
    else {
        if (session.userData['Lang'] && session.userData['Lang'] !== 'en') {
            var paramsTranslateFail = {
                text: queryResponse.failLandmark,
                from: 'en',
                to: session.userData['Lang']
            };
            client.translate(paramsTranslateFail, function (err, dataFail) {
                session.endDialog(dataFail);
            })
        } else {
            session.endDialog(queryResponse.failLandmark);
        };
    }
};

exports.handleErrorResponse = function (session, error) {
    var clientErrorMessage = queryResponse.errorResp;
    if (error.message && error.message.indexOf('Access denied') > -1) {
        clientErrorMessage += "\n\n" + error.message;
    }
    console.error(error);
    if (session.userData['Lang']) {
        var paramsTranslateErr = {
            text: clientErrorMessage,
            from: 'en',
            to: session.userData['Lang']
        };
        client.translate(paramsTranslateErr, function (err, dataErr) {
            session.endDialog(dataErr);
        })
    } else {
        session.endDialog(clientErrorMessage);
    };
};