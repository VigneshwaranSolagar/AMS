const campaignModel = require("../models/campaign.model");
const validateCampaign = require("../validators/campaign.validator");
const queueModel = require("../models/queue.model");
const contactModel = require("../models/contact.model");


exports.createCampaign = async (req, res) => {

    try {

        console.log("========== CREATE CAMPAIGN ==========");

        console.log("REQ.FILE:");
        console.log(req.file);

        console.log("REQ.BODY:");
        console.log(req.body);

        const errors = validateCampaign(req.body);

        if (errors.length > 0) {

            return res.status(400).json({

                success: false,

                errors

            });

        }

        const campaign = {

            ...req.body,

            attachment:

                req.file
                    ? `/uploads/campaigns/${req.file.filename}`
                    : req.body.template_attachment || null,

            attachment_name:

                req.file
                    ? req.file.originalname
                    : req.body.template_attachment_name || null,

            attachment_type:

                req.file
                    ? (
                        req.file.mimetype.startsWith("image/")
                            ? "image"
                            : req.file.mimetype.startsWith("video/")
                                ? "video"
                                : "document"
                    )
                    : req.body.template_attachment_type || null,

            mime_type:

                req.file
                    ? req.file.mimetype
                    : req.body.template_mime_type || null,

            file_size:

                req.file
                    ? req.file.size
                    : req.body.template_file_size || null,

            created_by:

                req.user.id

        };

        console.log("FINAL CAMPAIGN OBJECT:");
        console.log(campaign);

        const result =
            await campaignModel.create(campaign);

        console.log("Campaign Inserted. ID:", result.lastID);

        res.status(201).json({

            success: true,

            message: "Campaign created successfully.",

            id: result.lastID

        });

    }
    catch (err) {

        console.error("CREATE CAMPAIGN ERROR:");
        console.error(err);

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};



exports.getCampaigns = async (req,res)=>{

    try {

        const campaigns =
            await campaignModel.getAll();


        res.json({

            success:true,

            data:campaigns

        });


    }
    catch(err){

        res.status(500).json({

            success:false,

            message:err.message

        });

    }

};



exports.getCampaign = async(req,res)=>{


    const campaign =
        await campaignModel.getById(req.params.id);



    if(!campaign){

        return res.status(404).json({

            success:false,

            message:"Campaign not found."

        });

    }



    res.json({

        success:true,

        data:campaign

    });

};



exports.updateCampaign = async (req,res)=>{

    try {

        const errors =
            validateCampaign(req.body);


        if(errors.length > 0){

            return res.status(400).json({

                success:false,

                errors

            });

        }


        const campaign = {

            ...req.body

        };


        if(req.file){

            campaign.attachment =
                `/uploads/campaigns/${req.file.filename}`;


            campaign.attachment_name =
                req.file.originalname;


            campaign.mime_type =
                req.file.mimetype;

        }


        await campaignModel.update(

            req.params.id,

            campaign

        );


        res.json({

            success:true,

            message:
                "Campaign updated."

        });


    }
    catch(err){

        res.status(500).json({

            success:false,

            message:
                err.message

        });

    }

};



exports.deleteCampaign = async(req,res)=>{


    await campaignModel.remove(
        req.params.id
    );


    res.json({

        success:true,

        message:"Campaign deleted."

    });

};




exports.queueCampaign = async(req,res)=>{


    try {


        const campaign =
            await campaignModel.getById(
                req.params.id
            );



        if(!campaign){

            return res.status(404).json({

                success:false,

                message:"Campaign not found."

            });

        }



        let contacts = [];

switch (campaign.target_type) {

    case "All":

        contacts =
            await contactModel.getAll();

        break;

    case "Group":

        contacts =
            await contactModel.getByGroupId(
                campaign.target_value
            );

        break;

    case "Contacts":

        const contactIds =
            campaign.target_value
                .split(",")
                .map(id => Number(id))
                .filter(id => !isNaN(id));

        contacts = [];

        for (const id of contactIds) {

            const contact =
                await contactModel.getById(id);

            if (contact) {
                contacts.push(contact);
            }

        }

        break;

    case "Manual":

        const numbers =
            campaign.target_value
                .split(",")
                .map(number => number.trim())
                .filter(number => number);

        contacts =
            numbers.map(number => ({

                id: null,

                first_name: "",

                last_name: "",

                company: "",

                phone: number

            }));

        break;

    default:

        return res.status(400).json({

            success: false,

            message: "Invalid target type."

        });

}



        if(contacts.length===0){


            return res.status(400).json({

                success:false,

                message:"No contacts found for this campaign."

            });


        }



        let queued=0;



        for(const contact of contacts){



            const personalizedMessage =
                campaign.message

                .replace(
                    /{{first_name}}/g,
                    contact.first_name || ""
                )

                .replace(
                    /{{last_name}}/g,
                    contact.last_name || ""
                )

                .replace(
                    /{{company}}/g,
                    contact.company || ""
                )

                .replace(
                    /{{phone}}/g,
                    contact.phone || ""
                );



            await queueModel.create({

             campaign_id:
                campaign.id,

            contact_id:
               contact.id || 0,

             phone:
             contact.phone,

             message:
             personalizedMessage,

             attachment:
             campaign.attachment,

                attachment_name:
                campaign.attachment_name,

              mime_type:
                campaign.mime_type
});



            queued++;


        }



        await campaignModel.updateStatus(

            campaign.id,

            "Queued"

        );



        res.json({

            success:true,

            message:
                "Campaign queued successfully.",

            totalRecipients:
                queued

        });



    }
    catch(err){


        res.status(500).json({

            success:false,

            message:err.message

        });


    }

};