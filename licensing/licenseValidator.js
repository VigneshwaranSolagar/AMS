/**
 * AMS Licensing
 * License Validator
 */

const {
    LICENSE_VERSION,
    LICENSE_PLANS,
    REQUIRED_FIELDS
} = require("./models/license");

const {
    LICENSE_STATUS
} = require("./constants");

const Errors = require("./errors");

function validateLicense(license) {

    if (!license) {

        return Errors.failure(
            LICENSE_STATUS.LICENSE_NOT_FOUND,
            "License not found."
        );

    }

    // Check required fields
    for (const field of REQUIRED_FIELDS) {

        if (
            !Object.prototype.hasOwnProperty.call(
                license,
                field
            )
        ) {

            return Errors.failure(
                LICENSE_STATUS.MISSING_FIELDS,
                `Missing required field: ${field}`,
                license
            );

        }

    }

    // License version
    if (license.version !== LICENSE_VERSION) {

        return Errors.failure(
            LICENSE_STATUS.INVALID_VERSION,
            "Unsupported license version.",
            license
        );

    }

    // Plan validation
    if (
        !Object.values(LICENSE_PLANS).includes(
            license.plan
        )
    ) {

        return Errors.failure(
            LICENSE_STATUS.INVALID_PLAN,
            "Invalid license plan.",
            license
        );

    }

    // Date validation
    const issuedAt = new Date(
        license.issuedAt
    );

    const expiresAt = new Date(
        license.expiresAt
    );

    if (
        isNaN(issuedAt.getTime()) ||
        isNaN(expiresAt.getTime())
    ) {

        return Errors.failure(
            LICENSE_STATUS.INVALID_JSON,
            "Invalid license date.",
            license
        );

    }

    const now = new Date();

    // Issued date cannot be after expiry
    if (issuedAt > expiresAt) {

        return Errors.failure(
            LICENSE_STATUS.INVALID_JSON,
            "License issue date is after expiry date.",
            license
        );

    }

    // Expired license
    if (expiresAt < now) {

        return Errors.failure(
            LICENSE_STATUS.LICENSE_EXPIRED,
            "License has expired.",
            license
        );

    }

    return Errors.success(
        license
    );

}

module.exports = {
    validateLicense
};