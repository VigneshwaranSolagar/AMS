/**
 * AMS Licensing
 * Standard Response Helpers
 */

function success(license, message = "License is valid.") {

    return {
        activated: true,
        valid: true,
        code: "OK",
        message,
        license
    };

}

function failure(code, message, license = null) {

    return {
        activated: false,
        valid: false,
        code,
        message,
        license
    };

}

module.exports = {
    success,
    failure
};