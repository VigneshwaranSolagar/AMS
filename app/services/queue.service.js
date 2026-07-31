const queueModel = require("../models/queue.model");
const sender = require("../whatsapp/sender.service");
const campaignModel = require("../models/campaign.model");

async function processQueue() {

    const jobs = await queueModel.getPending();

    if (jobs.length === 0) {
        return;
    }

    console.log(`Pending Jobs: ${jobs.length}`);

    const processedCampaigns = new Set();

    for (const job of jobs) {

        try {

            console.log(`Sending to ${job.phone}`);

            await sender.sendMessage({

    phone: job.phone,

    message: job.message,

    attachment: job.attachment,

    attachment_type: job.attachment_type,

    mime_type: job.mime_type,

    attachment_name: job.attachment_name

});

            await queueModel.markSent(job.id);

            console.log(`✅ Queue ${job.id} Sent`);

            processedCampaigns.add(job.campaign_id);

        } catch (err) {

            await queueModel.markFailed(
                job.id,
                err.message
            );

            console.log(`❌ Queue ${job.id} Failed`);
            console.log(err.message);

        }

    }

    for (const campaignId of processedCampaigns) {

        const remainingJobs =
            await queueModel.getPendingByCampaign(
                campaignId
            );

        if (remainingJobs.length === 0) {

            await campaignModel.updateStatus(
                campaignId,
                "Completed"
            );

            console.log(
                `🏁 Campaign ${campaignId} Completed`
            );

        }

    }

}

module.exports = {
    processQueue
};