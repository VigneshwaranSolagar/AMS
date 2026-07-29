const CAMPAIGN_STATUS = Object.freeze({

    DRAFT: "Draft",

    QUEUED: "Queued",

    COMPLETED: "Completed",

    FAILED: "Failed",

    CANCELLED: "Cancelled"

});

const QUEUE_STATUS = Object.freeze({

    PENDING: "PENDING",

    SENT: "SENT",

    FAILED: "FAILED"

});

module.exports = {

    CAMPAIGN_STATUS,

    QUEUE_STATUS

};