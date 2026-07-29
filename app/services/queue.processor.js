const queueModel = require("../models/queue.model");
const sender = require("../whatsapp/sender.service");


async function processQueue() {

    const jobs = await queueModel.getPending();

    console.log(`Pending Jobs: ${jobs.length}`);


    for (const job of jobs) {

        try {

            console.log(`Sending to ${job.phone}`);


            await sender.sendText(
                job.phone,
                job.message
            );


            await queueModel.updateStatus(job.id,"SENT");


            console.log(
                `Sent Successfully: ${job.phone}`
            );


        } catch (error) {


            await queueModel.markFailed(
                job.id,
                error.message
            );


            console.log(
                `Failed: ${job.phone}`,
                error.message
            );

        }

    }

}


module.exports = {
    processQueue
};