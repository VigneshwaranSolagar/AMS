/**
 * AMS License Key Generator
 */

const crypto = require("crypto");


const MASTER_KEY =
    process.env.LICENSE_SECRET ||
    "AMS_DEFAULT_SECRET";



function stableStringify(obj) {

    return JSON.stringify(

        Object.keys(obj)
            .sort()
            .reduce(
                (result, key) => {

                    result[key] = obj[key];

                    return result;

                },
                {}
            )

    );

}



function generateActivationKey(data = {}) {


    const payload = {

        customer:
            data.customer || "Demo",

        machineFingerprint:
            data.machineFingerprint,

        plan:
            data.plan || "TRIAL",

        days:
            data.days || 30,

        createdAt:
            new Date().toISOString()

    };


    const raw =
        stableStringify(payload);



    const signature =
        crypto
        .createHmac(
            "sha256",
            MASTER_KEY
        )
        .update(raw)
        .digest("hex");



    return {

        payload,

        activationKey:
            Buffer
            .from(
                JSON.stringify({
                    payload,
                    signature
                })
            )
            .toString("base64")

    };


}



function verifyActivationKey(key) {


    try {


        const decoded =
            JSON.parse(
                Buffer
                .from(
                    key,
                    "base64"
                )
                .toString("utf8")
            );



        const raw =
            stableStringify(
                decoded.payload
            );



        const signature =
            crypto
            .createHmac(
                "sha256",
                MASTER_KEY
            )
            .update(raw)
            .digest("hex");
       



        return {

            valid:
            signature === decoded.signature,


            payload:
            decoded.payload

        };


    }
    catch(error){


        return {

            valid:false,

            message:error.message

        };

    }

}



module.exports = {

    generateActivationKey,

    verifyActivationKey

};