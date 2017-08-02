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
        session.userData['travelViewed'] = 'yes';
        //return;    
        if (session.userData['simViewed'] != 'yes') {
            session.replaceDialog('/alsochecksim');
        }
        else
            session.endDialog();
    }
];

function getCardsAttachments(session) {
    return [
        new builder.HeroCard(session)
            .title('EZ link Card')
            .subtitle('Continue Your Journey With Us Everyday')
            .text('Issued by EZ-Link Pte Ltd, the ez-link card was the very first contactless stored value card introduced for public transit use on the MRT, LRT and buses in April 2002. Due to its contactless nature, the card completes all its transactions within 0.2 seconds and in this way, revolutionarily makes travelling on buses and trains that much faster and smoother.')
            .images([
                builder.CardImage.create(session, 'http://www.ezlink.com.sg/cms/sitefiles/uploads/2014/07/recarding-color-ezlink-card1.jpg')
            ])
            .buttons([
                builder.CardAction.openUrl(session, 'http://www.ezlink.com.sg/get-your-ez-link-card/where-the-cards-are-sold', 'Learn More')
            ]),

        new builder.HeroCard(session)
            .title('NETS Flashpay')
            .subtitle('Pay in a flash!')
            .text('Use your NETS FlashPay Card here:MRT, LRT, public buses, Comfort & CityCab and SMRT taxis, Food courts, convenience stores, supermarkets and selected hawker centres ERP and CEPAS-compliant car park charges')
            .images([
                builder.CardImage.create(session, 'https://mir-s3-cdn-cf.behance.net/project_modules/disp/03a03914920663.5628ab05bd161.png')
            ])
            .buttons([
                builder.CardAction.openUrl(session, 'https://www.nets.com.sg/consumer/products/nets-flashpay', 'Learn More')
            ])
    ];
}
