const campaignModel = require("../models/campaign.model");
const contactModel = require("../models/contact.model");
const queueModel = require("../models/queue.model");

async function executeCampaigns() {

    try {

        const campaigns = await campaignModel.getAll();

        console.log(`Campaigns Found: ${campaigns.length}`);

        for (const campaign of campaigns) {

            // Skip deleted/orphan campaigns
            if (!campaign.id) {
                continue;
            }

            // Eligible campaigns
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

            // MVP supports only Group campaigns
            if (campaign.target_type !== "Group") {
                console.log(
                    `Skipping Campaign ${campaign.id} - Unsupported Target Type`
                );
                continue;
            }

            console.log(
                `Processing Campaign ${campaign.id} : ${campaign.name}`
            );

            const contacts = await contactModel.getByGroupId(
                campaign.target_value
            );

            console.log(
                `Contacts Found: ${contacts.length}`
            );

            if (!contacts || contacts.length === 0) {

                console.log(
                    `No contacts found for Campaign ${campaign.id}`
                );

                await campaignModel.updateStatus(
                    campaign.id,
                    "Failed"
                );

                continue;
            }

            let queuedCount = 0;

            for (const contact of contacts) {

                // Skip invalid phone numbers
                if (!contact.phone) {
                    continue;
                }

                let message = campaign.message || "";

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

                queuedCount++;
            }

            await campaignModel.updateStatus(
                campaign.id,
                "Queued"
            );

            console.log(
                `Campaign ${campaign.id} queued successfully (${queuedCount} messages)`
            );
        }

    } catch (error) {

        console.error(
            "Campaign Executor Error:",
            error
        );

    }

}

module.exports = {
    executeCampaigns
};