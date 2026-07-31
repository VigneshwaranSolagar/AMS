const fs = require("fs");
const path = require("path");

const templateModel =
    require("../models/template.model");

const validateTemplate =
    require("../validators/template.validator");

const sender =
    require("../whatsapp/sender.service");


function buildAttachment(file) {

    if (!file) {

        return {

            attachment: null,

            attachment_name: null,

            attachment_type: null,

            mime_type: null,

            file_size: null

        };

    }

    let attachmentType = "document";

    if (file.mimetype.startsWith("image/")) {

        attachmentType = "image";

    }
    else if (file.mimetype.startsWith("video/")) {

        attachmentType = "video";

    }

    return {

        attachment:
            "/uploads/templates/" +
            file.filename,

        attachment_name:
            file.originalname,

        attachment_type:
            attachmentType,

        mime_type:
            file.mimetype,

        file_size:
            file.size

    };

}



exports.createTemplate = async (req, res) => {

    try {

        const payload = {

            ...req.body,

            ...buildAttachment(req.file),

            created_by: req.user.id

        };

        const errors =
            validateTemplate(payload);

        if (errors.length > 0) {

            if (req.file) {

                fs.unlinkSync(req.file.path);

            }

            return res.status(400).json({

                success: false,

                errors

            });

        }

        const result =
            await templateModel.create(payload);

        res.status(201).json({

            success: true,

            message:
                "Template created successfully.",

            id:
                result.lastID

        });

    }

    catch (err) {

        if (req.file) {

            try {

                fs.unlinkSync(req.file.path);

            }
            catch {}

        }

        if (
            err.message.includes("UNIQUE")
        ) {

            return res.status(409).json({

                success: false,

                message:
                    "Template name already exists."

            });

        }

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};





exports.getTemplates = async (req, res) => {

    try {

        const templates =
            await templateModel.getAll();

        res.json({

            success: true,

            total:
                templates.length,

            data:
                templates

        });

    }

    catch (err) {

        res.status(500).json({

            success: false,

            message:
                err.message

        });

    }

};





exports.getTemplate = async (req, res) => {

    try {

        const template =
            await templateModel.getById(
                req.params.id
            );

        if (!template) {

            return res.status(404).json({

                success: false,

                message:
                    "Template not found."

            });

        }

        res.json({

            success: true,

            data: template

        });

    }

    catch (err) {

        res.status(500).json({

            success: false,

            message:
                err.message

        });

    }

};





exports.updateTemplate = async (req, res) => {

    try {

        const existing =
            await templateModel.getById(
                req.params.id
            );

        if (!existing) {

            if (req.file) {

                fs.unlinkSync(req.file.path);

            }

            return res.status(404).json({

                success: false,

                message: "Template not found."

            });

        }

        let attachment = {

            attachment:
                existing.attachment,

            attachment_name:
                existing.attachment_name,

            attachment_type:
                existing.attachment_type,

            mime_type:
                existing.mime_type,

            file_size:
                existing.file_size

        };

        /* =====================================
           Remove Existing Attachment
        ===================================== */

        if (
            req.body.remove_attachment === "true"
        ) {

            if (existing.attachment) {

                const oldFile = path.join(

                    __dirname,

                    "..",

                    existing.attachment.replace(
                        /^\//,
                        ""
                    )

                );

                if (
                    fs.existsSync(oldFile)
                ) {

                    fs.unlinkSync(oldFile);

                }

            }

            attachment = {

                attachment: null,

                attachment_name: null,

                attachment_type: null,

                mime_type: null,

                file_size: null

            };

        }

        /* =====================================
           Replace Attachment
        ===================================== */

        else if (req.file) {

            if (existing.attachment) {

                const oldFile = path.join(

                    __dirname,

                    "..",

                    existing.attachment.replace(
                        /^\//,
                        ""
                    )

                );

                if (
                    fs.existsSync(oldFile)
                ) {

                    fs.unlinkSync(oldFile);

                }

            }

            attachment =
                buildAttachment(
                    req.file
                );

        }

        const payload = {

            ...req.body,

            ...attachment

        };

        const errors =
            validateTemplate(
                payload
            );

        if (errors.length > 0) {

            if (req.file) {

                fs.unlinkSync(
                    req.file.path
                );

            }

            return res.status(400).json({

                success: false,

                errors

            });

        }

        const result =
            await templateModel.update(

                req.params.id,

                payload

            );

        res.json({

            success: true,

            message:
                "Template updated successfully.",

            changes:
                result.changes

        });

    }

    catch (err) {

        if (req.file) {

            try {

                fs.unlinkSync(
                    req.file.path
                );

            }

            catch {}

        }

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

exports.deleteTemplate = async (req, res) => {

    try {

        const existing =
            await templateModel.getById(
                req.params.id
            );

        if (!existing) {

            return res.status(404).json({

                success: false,

                message:
                    "Template not found."

            });

        }

        if (existing.attachment) {

            const file = path.join(

    __dirname,

    "..",

    existing.attachment.replace(
        /^\//,
        ""
    )

);

            if (

                fs.existsSync(file)

            ) {

                fs.unlinkSync(file);

            }

        }

        await templateModel.remove(
            req.params.id
        );

        res.json({

            success: true,

            message:
                "Template deleted successfully."

        });

    }

    catch (err) {

        res.status(500).json({   success: false,message:err.message});

    }

};

exports.sendTestMessage = async (req, res) => {

    try {

        let attachment = {};

        if (req.file) {

            attachment = buildAttachment(req.file);

        }
        else {

            attachment = {

                attachment:
                    req.body.template_attachment,

                mime_type:
                    req.body.template_mime_type,

                attachment_name:
                    req.body.template_attachment_name

            };

        }

        await sender.sendMessage({

            phone:
                req.body.phone,

            message:
                req.body.message,

            attachment:
                attachment.attachment,

            mime_type:
                attachment.mime_type,

            attachment_name:
                attachment.attachment_name

        });

        res.json({

            success: true,

            message:
                "Test message sent successfully."

        });

    }
    catch (err) {

        res.status(500).json({

            success: false,

            message:
                err.message

        });

    }

};