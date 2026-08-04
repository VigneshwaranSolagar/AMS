/**
 * AMS
 * RSA License Key Generator
 */

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");


const PRIVATE_KEY =
    fs.readFileSync(
        path.join(
            __dirname,
            "keys",
            "private.pem"
        ),
        "utf8"
    );



function generateActivationKey(data = {}) {


    const payload = {


        customer:
            data.customer || "Demo",


        fingerprintVersion:
            data.fingerprintVersion || 1,


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
        JSON.stringify(payload);



    const signature =
        crypto.sign(
            "sha256",
            Buffer.from(raw),
            PRIVATE_KEY
        )
        .toString("base64");



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



module.exports = {

    generateActivationKey

};