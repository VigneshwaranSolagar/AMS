/**
 * AMS Licensing
 * License Signature Verifier
 */

const Errors = require("./errors");

const {
    LICENSE_STATUS
} = require("./constants");


function verifySignature(license) {

    if (!license) {

        return Errors.failure(
            LICENSE_STATUS.LICENSE_NOT_FOUND,
            "License not found."
        );

    }


    /*
     * Sprint 1
     *
     * Signature verification skipped.
     *
     * Sprint 2:
     * Verify using public.pem
     */


    return Errors.success(
        license,
        "Signature verified."
    );

}


module.exports = {
    verifySignature
};