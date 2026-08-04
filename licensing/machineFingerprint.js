/**
 * AMS Licensing
 * Stable Machine Fingerprint Generator
 */

const os = require("os");
const crypto = require("crypto");
const { execSync } = require("child_process");


function getWindowsMachineGuid() {

    try {

        const result =
            execSync(
                'reg query "HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Cryptography" /v MachineGuid'
            )
            .toString();


        const match =
            result.match(
                /MachineGuid\s+REG_SZ\s+([^\r\n]+)/
            );


        if (match && match[1]) {

            return match[1].trim();

        }

    }
    catch(error) {

        console.error(
            "MachineGuid read failed:",
            error.message
        );

    }


    return "UNKNOWN_MACHINE_GUID";

}



function getMachineFingerprint() {


    const data = {


        machineGuid:
            getWindowsMachineGuid(),


        hostname:
            os.hostname(),


        platform:
            os.platform(),


        arch:
            os.arch(),


        cpu:
            os.cpus()
            .map(
                cpu => cpu.model
            )
            .join("|")


    };


    const raw =
        JSON.stringify(data);



    return crypto
        .createHash("sha256")
        .update(raw)
        .digest("hex");


}



module.exports = {

    getMachineFingerprint

};