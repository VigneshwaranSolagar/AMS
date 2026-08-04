/**
 * AMS RSA License Verifier
 */

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");


const PUBLIC_KEY =
    fs.readFileSync(
        path.join(
            __dirname,
            "keys",
            "public.pem"
        ),
        "utf8"
    );



function verifyActivationKey(key) {

    try {


        const decoded =
            typeof key === "string"
            ? JSON.parse(key)
            : key;



        const raw =
            JSON.stringify(
                decoded.payload
            );



        const valid =
            crypto.verify(

                "sha256",

                Buffer.from(raw),

                PUBLIC_KEY,

                Buffer.from(
                    decoded.signature,
                    "base64"
                )

            );



        if (!valid) {

            return {

                valid:false,

                message:
                    "Invalid RSA signature."

            };

        }



        return {

            valid:true,

            payload:
                decoded.payload,

            message:
                "License verified."

        };


    }
    catch(error) {


        return {

            valid:false,

            message:
                error.message

        };

    }

}



module.exports = {

    verifyActivationKey

};