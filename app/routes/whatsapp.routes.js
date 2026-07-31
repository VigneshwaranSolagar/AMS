const express = require("express");

const router = express.Router();

const authenticate =
    require("../middleware/auth.middleware");


const sender =
    require("../whatsapp/sender.service");


const {

    startWhatsApp,

    getWhatsAppInfo,

    getQRCode,

    disconnectWhatsApp

}
=
require("../whatsapp/whatsapp.service");

router.get(
"/qr",
(req,res)=>{


    res.json({

        success:true,

        qr:getQRCode()

    });


});

router.get(
"/test",
(req,res)=>{

    res.json({

        success:true,

        message:
        "WhatsApp route is working."

    });

});





// =================================
// WhatsApp Status
// =================================

router.get(
"/status",
(req,res)=>{


    res.json({

        success:true,

        data:
        getWhatsAppInfo()

    });


});





// =================================
// Connect WhatsApp
// =================================

router.post(
"/connect",
async(req,res)=>{


    try {


        await startWhatsApp();


        res.json({

            success:true,

            message:
            "WhatsApp connection started."

        });


    }
    catch(error){


        res.status(500).json({

            success:false,

            message:
            error.message

        });


    }


});





// =================================
// Disconnect WhatsApp
// =================================

router.post(
"/disconnect",
async(req,res)=>{


    try {


        await disconnectWhatsApp(false);


        res.json({

            success:true,

            message:
            "WhatsApp disconnected."

        });


    }
    catch(error){


        res.status(500).json({

            success:false,

            message:
            error.message

        });


    }


});





// =================================
// Change WhatsApp Number
// =================================

router.post(
"/change",
async(req,res)=>{


    try {


        await disconnectWhatsApp(true);


        setTimeout(()=>{


            startWhatsApp();


        },1000);



        res.json({

            success:true,

            message:
            "New WhatsApp connection started."

        });


    }
    catch(error){


        res.status(500).json({

            success:false,

            message:
            error.message

        });


    }


});





// =================================
// Send Message
// =================================

router.post(
"/send",
authenticate,
async(req,res)=>{


    try {


        await sender.sendMessage({

            phone:req.body.phone,

            message:req.body.message

        });



        res.json({

            success:true,

            message:
            "Message sent."

        });


    }
    catch(err){


        res.status(500).json({

            success:false,

            message:
            err.message

        });


    }


});





console.log(
"✅ WhatsApp routes loaded"
);



module.exports = router;