/**
 * AMS Licensing
 * Device Fingerprint
 *
 * Sprint 1
 * ----------
 * Generates a deterministic device ID using
 * system information.
 *
 * Sprint 2
 * ----------
 * Replace the fingerprint source with
 * Windows Machine GUID + hardware identifiers.
 */

const os = require("os");
const crypto = require("crypto");

function getDeviceId() {

    const fingerprint = [

        os.hostname(),

        os.platform(),

        os.arch(),

        os.cpus()[0]?.model || "",

        os.totalmem().toString()

    ].join("|");

    return crypto
        .createHash("sha256")
        .update(fingerprint)
        .digest("hex")
        .toUpperCase();

}

module.exports = {
    getDeviceId
};