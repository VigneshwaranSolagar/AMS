/**
 * AMS Licensing
 * Main Licensing Export
 */

const {
    getActivationState
} = require("./activationState");

const {
    verifyActivationKey
} = require("./licenseVerifier");

const {
    getMachineFingerprint
} = require("./machineFingerprint");

const licenseManager =
    require("./licenseManager");

module.exports = {

    getActivationState,

    getMachineFingerprint,

    verifyActivationKey,

    createLicense:
        licenseManager.createLicense,

    readLicense:
        licenseManager.readLicense,

    validateLicense:
        licenseManager.validateLicense

};