// This loads the environment variables from the .env file
require('dotenv-extended').load();

var builder = require('botbuilder');

module.exports = [
    function (session) {
        var cards = getCardsAttachments();
        // create reply with Carousel AttachmentLayout
        var reply = new builder.Message(session)
            .attachmentLayout(builder.AttachmentLayout.carousel)
            .attachments(cards);

        session.send(reply);
        session.userData['simViewed'] = 'yes';
        //return;
        if (session.userData['travelViewed'] != 'yes'){
            session.replaceDialog('/alsochecktravel');
        }
        else
            session.endDialog();
    }
];

function getCardsAttachments(session) {
    return [
        new builder.HeroCard(session)
            .title('Singtel')
            .subtitle('hi!Tourist SIM Cards')
            .text('Enjoy unlimited calls, SMS and social messaging with Singtel hi!Tourist SIM Cards. All on a blazing-fast 4G network! Available in three values: $15, $30 and $50.To find out which one best matches your needs, click for details. Document required : Passport')
            .images([
                builder.CardImage.create(session, 'https://www.singtel.com/content/dam/singtel/phones-plans/singtel-prepaid/card-hitourist_15.jpg')
            ])
            .buttons([
                builder.CardAction.openUrl(session, 'https://www.singtel.com/personal/i/phones-plans/mobile/prepaid/hitouristsimcards', 'Learn More')
            ]),

        new builder.HeroCard(session)
            .title('Starhub')
            .subtitle('Happy Travel SIM')
            .text('Our travel SIM cards give you the best data bundles so that you can chat and surf worry-free in Singapore. Simply get your prepaid card upon arrival at Changi Airport and choose between our $15, $18, $32 and $50 SIM. You can use your stored credits to make local or IDD calls, SMS and activate value-added services. Need more credit? Simply top up via our Happy Prepaid App, online or in stores!')
            .images([
                builder.CardImage.create(session, 'http://www.starhub.com/content/dam/starhub/2015/mobile/prepaid-plan/Prepaid-Sim-cards/Sim-card-face-2015/18-internet-prepaid-sim.jpg')
            ])
            .buttons([
                builder.CardAction.openUrl(session, 'http://www.starhub.com/personal/mobile/mobile-phones-plans/prepaid-cards/internet-sim.html', 'Learn More')
            ]),

        new builder.HeroCard(session)
            .title('M1')
            .subtitle('Tourist prepaid SIM')
            .text('Get 100GB data with M1 Prepaid Tourist SIM and stay connected upon arrival in Singapore! Starts from SGD 15, different packs available based on needs. 3G and 4G support. Purchase your M1 Tourist SIM Card at Changi Airport, Terminal 1, 2 and 3')
            .images([
                builder.CardImage.create(session, 'https://www.m1.com.sg/personal/mobile/prepaidmobile/~/media/Images/M1Portal/Consumer/Mobile%20Phones%20and%20Plans/Prepaid/MCard/mcard-15tourist')
            ])
            .buttons([
                builder.CardAction.openUrl(session, 'https://www.m1.com.sg/Personal/BUNDLES%20AND%20PROMOTIONS/HIGHLIGHTS/Prepaid-TouristSIM', 'Learn More')
            ])
    ];
}
