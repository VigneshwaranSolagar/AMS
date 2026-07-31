/**
 * AMS Licensing
 * License Model
 * Version 1
 */

const LICENSE_VERSION = 1;

const LICENSE_PLANS = Object.freeze({

    TRIAL: "Trial",

    BUSINESS: "Business",

    ENTERPRISE: "Enterprise"

});

const REQUIRED_FIELDS = Object.freeze([

    "version",

    "licenseId",

    "customer",

    "plan",

    "deviceId",

    "issuedAt",

    "expiresAt",

    "signature"

]);

module.exports = {

    LICENSE_VERSION,

    LICENSE_PLANS,

    REQUIRED_FIELDS

};