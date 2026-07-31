/**
 * AMS License Guard
 */

const licensing = require("../../licensing");


function licenseGuard(req, res, next) {


    const state =
        licensing.getActivationState();



    if (
        state.status !== "ACTIVE"
    ) {


        return res.status(403).json({

            success:false,

            message:
            "AMS license validation failed.",

            license: state

        });


    }


    next();


}


module.exports = licenseGuard;