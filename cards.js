var builder = require('botbuilder');

//Dialog labels
var DialogLabels = {
    Sims: 'Mobile SIM',
    Travel: 'Bus/MRT'
};


module.exports = [
    function (session) {
        var utilityCard = new builder.HeroCard(session)
            .title('Recommended utilities')
            .subtitle('Consider getting the following cards')
            .images([
                new builder.CardImage(session)
                    .url('http://organisationdevelopment.org/wp-content/uploads/2012/05/0280393f5a5f70b0f4dd5997659650de.jpeg')
                    .alt('Essentials')
            ])
            .buttons([
                builder.CardAction.imBack(session, session.gettext(DialogLabels.Sims), DialogLabels.Sims),
                builder.CardAction.imBack(session, session.gettext(DialogLabels.Travel), DialogLabels.Travel),
            ]);

        session.send(new builder.Message(session)
            .addAttachment(utilityCard));
        //return;    
        session.endDialog();
    }
];

