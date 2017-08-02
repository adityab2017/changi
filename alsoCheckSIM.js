var builder = require('botbuilder');

module.exports = [
    function (session) {
        builder.Prompts.text(session,'Would you also be interested to check out the SIM cards?');
    },
    function (session, results) {
        if (results.response == 'no') {
            session.endDialog('Alright, some other time!');
        }
        else {
                session.send("Great. Here are the options:");
                session.replaceDialog('/simcard');
        }
       }
];

