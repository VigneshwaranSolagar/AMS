/**
 * AMS Licensing
 * Activation State Validator
 */

const {
    readLicense
} = require("./licenseManager");


const {
    getMachineFingerprint
} = require("./machineFingerprint");



function getActivationState() {

    try {


        const license =
            readLicense();


        if (!license) {

            return {

                status: "NOT_ACTIVATED",

                message:
                "License not found."

            };

        }

console.log(
    "STORED LICENSE FINGERPRINT:",
    license?.machineFingerprint
);

console.log(
    "CURRENT MACHINE FINGERPRINT:",
    getMachineFingerprint()
);

        // Machine validation

        if (
            license.machineFingerprint !==
            getMachineFingerprint()
        ) {

            return {

                status: "INVALID",

                message:
                "License is not registered to this machine."

            };

        }



        // Expiry validation

        const activatedDate =
            new Date(
                license.activatedAt
            );


        const expiryDate =
            new Date(activatedDate);


        expiryDate.setDate(
            expiryDate.getDate()
            +
            Number(license.days || 0)
        );


        const today =
            new Date();



        if (
            today > expiryDate
        ) {

            return {

                status:"EXPIRED",

                message:
                "License expired.",

                expiresAt:
                expiryDate.toISOString()

            };

        }



        const remainingDays =
            Math.ceil(
                (
                    expiryDate - today
                )
                /
                (1000 * 60 * 60 * 24)
            );



        return {

            status:"ACTIVE",

            customer:
            license.customer,

            plan:
            license.plan,

            activatedAt:
            license.activatedAt,

            expiresAt:
            expiryDate.toISOString(),

            remainingDays

        };


    }
    catch(error) {


        return {

            status:"ERROR",

            message:error.message

        };


    }

}



module.exports = {

    getActivationState

};