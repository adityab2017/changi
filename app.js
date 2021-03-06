﻿// JavaScript source code
//https://d271dy38uexjzn.cloudfront.net/wp-content/uploads/image04-9.jpg
// References
require('dotenv-extended').load();
var needle              = require('needle'),
    url                 = require('url'),
    validUrl            = require('valid-url'),
    bluebird            = require('bluebird'),
    landmarkIdentify = require('./landmark_identify'),
    restify             = require('restify'),
    builder             = require('botbuilder'),
    request             = require('request'),
    utils               = require('./utils'),
    translator          = require('mstranslator'),
    cognitiveservices   = require('./qna/botbuilder-cognitiveservices'); 

//Setup Translator
var client = new translator({
    api_key: process.env.MICROSOFT_TRANSLATOR_KEY // use this for the new token API. 
}, true);

//Standard Replies
var standardReplies = utils.stdResponse;

//Utility cards
var choiceLabels = utils.choiceLabels;

//=========================================================
// Bot Setup
//=========================================================

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});

//LUIS Setup
var recognizer = new builder.LuisRecognizer('https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/' + process.env.LUIS_APP_KEY + '?subscription-key=' + process.env.LUIS_SUBS_KEY +'&verbose=true&timezoneOffset=0&q=');
var intentDialog = new builder.IntentDialog({ recognizers: [recognizer] });

//QnA Setup
var qnaRecognizer = new cognitiveservices.QnAMakerRecognizer({
    knowledgeBaseId: 'd0880ff1-b7ce-488a-8d5e-b20337c7b605', 
    subscriptionKey: '47e2641a113545c3bd057cf8c6618bdd'});
	
var basicQnAMakerDialog = new cognitiveservices.QnAMakerDialog({
	recognizers: [qnaRecognizer],
	defaultMessage: 'No match! Try changing the query terms!',
	qnaThreshold: 0.3
});

// Create chat bot
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
var bot = new builder.UniversalBot(connector, { persistConversationData: true });
server.post('/api/messages', connector.listen());

// Bot Dialogs
bot.dialog('/', intentDialog);

//=========================================================
//  LUIS Intents
//=========================================================

intentDialog.matches(/\b(hello|hi|hey|how are you)\b/i, '/firstLoad')
    .matches(/\b(Mobile SIM)\b/i, '/simcard')
    .matches(/\b(Bus[/]MRT)\b/i, '/travelcard')
    //.matches(/\b(Thanks)\b/i, '/thanks')
    .matches('Thanks', '/thanks')
    .matches(/\b(reset)\b/i, '/resetLang')
    .matches(/\b(rbot)\b/i, '/resetLang')
    .matches('getPlacethruPic', '/landmark')
    .matches('questions', '/qna')
    .matches('changeToEng', '/langToEng')
    .onDefault('/defaultResp');

bot.dialog('/firstLoad', [
    function (session) {
        //check if language is set
        session.beginDialog('/language');
    },
    function (session, results) {
        if (session.userData['Lang'] == 'en') {
            session.beginDialog('/country');
        }
        else {
         //   session.send('Lang not english');
            session.replaceDialog('/');
        }
    },
    function (session, results) {
        if (session.userData['Lang'] == 'en') {
            session.replaceDialog('/cards');
        }
        else {
        //    session.send('Lang not english - loop2');
            session.replaceDialog('/');
        }
    }    
]);

bot.dialog('/travelcard', require('./travel'));
bot.dialog('/alsochecktravel', require('./alsoCheckTravel'));
bot.dialog('/simcard', require('./SIM'));
bot.dialog('/alsochecksim', require('./alsoCheckSIM'));
bot.dialog('/language', require('./lang'));
bot.dialog('/country', require('./country'));
bot.dialog('/cards', require('./cards'));
bot.dialog('/landmark', require('./imagescan'));

bot.dialog('/resetLang', function (session, args) {
    session.sendTyping();
    session.userData['Lang'] = null;
    session.userData['country'] = null;
    session.userData['simViewed'] = null;
    session.userData['travelViewed'] = null;
    session.endDialog(standardReplies.langReset);
});

bot.dialog('/thanks', function (session, args) {
    session.endDialog('Happy to help.\n\nLet me know if you need anything');
});

bot.dialog('/langToEng', function (session) {
    session.userData['Lang'] = 'en';
    session.send(standardReplies.langEng);
    session.replaceDialog('/firstLoad');
});

bot.dialog('defaultResp', function (session) {
    session.send('Sorry, I didn\'t catch that.\n\n Could you please try again?');
    session.replaceDialog('/');
});