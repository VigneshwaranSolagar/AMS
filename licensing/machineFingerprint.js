/**
 * AMS Licensing
 * Machine Fingerprint Generator
 */

const os = require("os");
const crypto = require("crypto");


function getMachineFingerprint() {

    const data = {

        hostname: os.hostname(),

        platform: os.platform(),

        arch: os.arch(),

        cpus: os.cpus()
            .map(cpu => cpu.model)
            .join("|"),

        totalMemory: os.totalmem(),

        network: Object.values(
            os.networkInterfaces()
        )
        .flat()
        .filter(item => !item.internal)
        .map(item => item.mac)
        .join("|")

    };


    const raw = JSON.stringify(data);


    return crypto
        .createHash("sha256")
        .update(raw)
        .digest("hex");

}


module.exports = {
    getMachineFingerprint
};