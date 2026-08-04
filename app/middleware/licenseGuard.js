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

      success: false,

      code: "LICENSE_INVALID",

      message: "License missing, invalid or expired."

     });


    }


    next();


}


module.exports = licenseGuard;