const campaignModel = require("../models/campaign.model");
const contactModel = require("../models/contact.model");
const queueModel = require("../models/queue.model");


async function executeCampaigns() {

    const campaigns = await campaignModel.getAll();


    for (const campaign of campaigns) {


        // Process only eligible campaigns

        const isInstant =
            campaign.campaign_type === "Instant" &&
            campaign.status === "Draft";


        const isScheduled =
            campaign.campaign_type === "Scheduled" &&
            campaign.status === "Scheduled" &&
            campaign.scheduled_at &&
            new Date(campaign.scheduled_at) <= new Date();



        if (!isInstant && !isScheduled) {
            continue;
        }



        // MVP: Group campaigns only

        if (campaign.target_type !== "Group") {
            continue;
        }


        console.log(
            `Processing Campaign: ${campaign.id}`
        );


        const contacts = await contactModel.getByGroupId(
            campaign.target_value
        );


        console.log(
            `Contacts Found: ${contacts.length}`
        );



        if (contacts.length === 0) {

            console.log(
                `⚠️ No contacts found for Campaign ${campaign.id}`
            );

            continue;

        }



        for (const contact of contacts) {


            let message = campaign.message;



            message = message.replace(
                /{{first_name}}/g,
                contact.first_name || ""
            );


            message = message.replace(
                /{{last_name}}/g,
                contact.last_name || ""
            );



            await queueModel.create({

                campaign_id: campaign.id,

                contact_id: contact.id,

                phone: contact.phone,

                message

            });


        }



        await campaignModel.updateStatus(
            campaign.id,
            "Queued"
        );



        console.log(
            `✅ Campaign ${campaign.id} queued (${contacts.length} contacts)`
        );


    }

}



module.exports = {
    executeCampaigns
};