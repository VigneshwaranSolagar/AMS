const queueModel = require("../models/queue.model");
const campaignModel = require("../models/campaign.model");

const {
    sendMessage
} = require("../whatsapp/sender.service");

async function processQueue() {

    try {

        const queue = await queueModel.getPending();

        if (queue.length === 0) {
            return;
        }

        console.log(`Pending Queue : ${queue.length}`);

        for (const item of queue) {

            try {

                console.log({
                    attachment: item.attachment,
                    attachment_name: item.attachment_name,
                    mime_type: item.mime_type
                });

                await sendMessage({

                    phone: item.phone,

                    message: item.message,

                    attachment: item.attachment,

                    mime_type: item.mime_type,

                    attachment_name: item.attachment_name

                });

                await queueModel.updateStatus(
                    item.id,
                    "SENT"
                );

                console.log(
                    `✅ Sent -> ${item.phone}`
                );

            }
            catch (error) {

                console.error(
                    `❌ Failed -> ${item.phone}`,
                    error.message
                );

                await queueModel.incrementRetry(
                    item.id
                );

            }

            // Check campaign completion

            const pending =
                await queueModel.getPendingCountByCampaign(
                    item.campaign_id
                );

            if (pending === 0) {

                await campaignModel.updateStatus(
                    item.campaign_id,
                    "Completed"
                );

                console.log(
                    `🏁 Campaign ${item.campaign_id} Completed`
                );

            }

        }

    }
    catch (error) {

        console.error(
            "Queue Processor Error:",
            error
        );

    }

}

module.exports = {
    processQueue
};