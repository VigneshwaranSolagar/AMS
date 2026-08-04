/**
 * AMS Licensing
 * License Manager
 */

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const paths = require("../app/config/paths");

const {
    getMachineFingerprint
} = require("./machineFingerprint");



function createLicense(data = {}) {


    const license = {

        product: "AMS",

        version: "1.0",

        activatedAt:
            new Date().toISOString(),

        customer:
            data.customer || "Demo User",

        plan:
            data.plan || "TRIAL",

        days:
            data.days || 30,

        machineFingerprint:
            data.machineFingerprint ||
            getMachineFingerprint()

    };



    const encrypted =
        encrypt(
            JSON.stringify(license)
        );



    const licenseDirectory =
        path.dirname(
            paths.licenseFile
        );



    if (!fs.existsSync(licenseDirectory)) {

        fs.mkdirSync(
            licenseDirectory,
            {
                recursive:true
            }
        );

    }



    fs.writeFileSync(
        paths.licenseFile,
        encrypted,
        "utf8"
    );



    return license;

}





function readLicense() {


    try {


        if (!fs.existsSync(paths.licenseFile)) {

            return null;

        }



        const encrypted =
            fs.readFileSync(
                paths.licenseFile,
                "utf8"
            );



        return JSON.parse(
            decrypt(encrypted)
        );


    }
    catch(error) {


        console.error(
            "License read failed:",
            error.message
        );


        return null;


    }

}





function validateLicense() {


    const license =
        readLicense();



    if (!license) {


        return {

            valid:false,

            reason:
                "LICENSE_NOT_FOUND"

        };


    }



    if (
        license.machineFingerprint !==
        getMachineFingerprint()
    ) {


        return {

            valid:false,

            reason:
                "MACHINE_MISMATCH"

        };


    }



    return {


        valid:true,

        license


    };


}





const ENCRYPTION_KEY =
    crypto
    .createHash("sha256")
    .update(
        process.env.LICENSE_SECRET ||
        "AMS_DEFAULT_SECRET"
    )
    .digest();



const IV =
    Buffer.alloc(
        16,
        0
    );





function encrypt(text) {


    const cipher =
        crypto.createCipheriv(
            "aes-256-cbc",
            ENCRYPTION_KEY,
            IV
        );



    let encrypted =
        cipher.update(
            text,
            "utf8",
            "hex"
        );



    encrypted +=
        cipher.final(
            "hex"
        );



    return encrypted;


}





function decrypt(text) {


    const decipher =
        crypto.createDecipheriv(
            "aes-256-cbc",
            ENCRYPTION_KEY,
            IV
        );



    let decrypted =
        decipher.update(
            text,
            "hex",
            "utf8"
        );



    decrypted +=
        decipher.final(
            "utf8"
        );



    return decrypted;


}





module.exports = {

    createLicense,

    readLicense,

    validateLicense

};