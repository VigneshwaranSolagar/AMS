/**
 * AMS Licensing
 * Main Licensing Export
 */


const {
    getActivationState
} = require("./activationState");


const {
    verifySignature
} = require("./licenseVerifier");


const {
    getMachineFingerprint
} = require("./machineFingerprint");


const licenseManager =
require("./licenseManager");

const keyGenerator =
require("./keyGenerator");

module.exports = {

    getActivationState,

    verifySignature,

    getMachineFingerprint,

    createLicense:
        licenseManager.createLicense,

    readLicense:
        licenseManager.readLicense,

    validateLicense:
        licenseManager.validateLicense,
    
        verifyActivationKey:
     keyGenerator.verifyActivationKey,

};