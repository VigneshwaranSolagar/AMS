const licensing = require("../../licensing");


function status(req, res) {

    const activation =
        licensing.getActivationState();

    res.json(activation);

}


function fingerprint(req, res) {

    try {

        const id =
            licensing.getMachineFingerprint();

        res.json({

            success: true,
            fingerprint: id

        });

    }
    catch(error){

        res.status(500).json({

            success:false,
            message:error.message

        });

    }

}


function activate(req, res) {

    try {

        const {

            customer = "Demo User",

            plan = "TRIAL",

            days = 30

        } = req.body;


        const license =
            licensing.createLicense({

                customer,

                plan,

                days

            });


        res.json({

            success:true,

            message:"License activated",

            license

        });


    }
    catch(error){

        console.error(
            "Activation Error:",
            error
        );


        res.status(500).json({

            success:false,

            message:error.message

        });

    }

}

function activateKey(req,res){

    try {

        const result =
            licensing.verifyActivationKey(
                req.body.activationKey
            );


        if(!result.valid){

            return res.status(400).json({

                success:false,

                message:"Invalid activation key"

            });

        }


        const license =
            licensing.createLicense(
                result.payload
            );


        res.json({

            success:true,

            message:"AMS activated successfully",

            license

        });


    }
    catch(error){

        res.status(500).json({

            success:false,

            message:error.message

        });

    }

}

module.exports = {

    status,

    fingerprint,

    activate,

    activateKey

};