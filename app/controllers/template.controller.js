const templateModel = require("../models/template.model");
const validateTemplate = require("../validators/template.validator");

exports.createTemplate = async (req, res) => {

    try {

        const errors = validateTemplate(req.body);

        if (errors.length > 0) {

            return res.status(400).json({
                success: false,
                errors
            });

        }

        const template = {

            ...req.body,

            created_by: req.user.id

        };

        const result =
            await templateModel.create(template);

        res.status(201).json({

            success: true,

            message: "Template created successfully.",

            id: result.lastID

        });

    }

    catch (err) {

        if (err.message.includes("UNIQUE")) {

            return res.status(409).json({

                success: false,

                message: "Template name already exists."

            });

        }

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

exports.getTemplates = async (req, res) => {

    const templates =
        await templateModel.getAll();

    res.json({

        success: true,

        total: templates.length,

        data: templates

    });

};

exports.getTemplate = async (req, res) => {

    const template =
        await templateModel.getById(req.params.id);

    if (!template) {

        return res.status(404).json({

            success: false,

            message: "Template not found."

        });

    }

    res.json({

        success: true,

        data: template

    });

};

exports.updateTemplate = async (req, res) => {

    try {

        const result =
            await templateModel.update(
                req.params.id,
                req.body
            );

        if (result.changes === 0) {

            return res.status(404).json({

                success: false,

                message: "Template not found."

            });

        }

        res.json({

            success: true,

            message: "Template updated successfully."

        });

    }

    catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

exports.deleteTemplate = async (req, res) => {

    try {

        const result =
            await templateModel.remove(
                req.params.id
            );

        if (result.changes === 0) {

            return res.status(404).json({

                success: false,

                message: "Template not found."

            });

        }

        res.json({

            success: true,

            message: "Template deleted successfully."

        });

    }

    catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};