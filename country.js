var builder = require('botbuilder'),
    utils = require('./utils'),
    translator = require('mstranslator');

//Standard Replies
var standardReplies = utils.stdResponse;

module.exports = [
    function (session) {
        // welcome and home country
        session.send("Hello! Welcome to Singapore.");
        console.log("User's first load ");
        if (!session.userData['country']) {
            builder.Prompts.text(session, "Which country are you from?");
        }
        else {
            session.endDialog();
        }
    },
    function (session, results) {
        session.userData['country'] = results.response;
        session.send('Great to have you here. \n\nI will customize the results based on what\'s popular with your countrymen');
        session.endDialog();
    }
];