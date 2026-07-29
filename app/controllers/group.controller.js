const groupModel = require("../models/group.model");

exports.createGroup = async (req, res) => {

    try {

        const result = await groupModel.create(req.body);

        res.status(201).json({
            success: true,
            message: "Group created.",
            id: result.lastID
        });

    } catch (err) {

        if (err.message.includes("UNIQUE")) {

            return res.status(409).json({
                success: false,
                message: "Group already exists."
            });

        }

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

exports.getGroups = async (req, res) => {

    const groups = await groupModel.getAll();

    res.json({
        success: true,
        total: groups.length,
        data: groups
    });

};

exports.getGroup = async (req, res) => {

    const group = await groupModel.getById(req.params.id);

    if (!group) {

        return res.status(404).json({
            success: false,
            message: "Group not found."
        });

    }

    res.json({
        success: true,
        data: group
    });

};

exports.updateGroup = async (req, res) => {

    try {

        const result =
            await groupModel.update(
                req.params.id,
                req.body
            );

        if (result.changes === 0) {

            return res.status(404).json({

                success: false,

                message: "Group not found."

            });

        }

        res.json({

            success: true,

            message: "Group updated successfully."

        });

    }

    catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};



exports.deleteGroup = async (req, res) => {

    try {

        const result =
            await groupModel.remove(
                req.params.id
            );

        if (result.changes === 0) {

            return res.status(404).json({

                success: false,

                message: "Group not found."

            });

        }

        res.json({

            success: true,

            message: "Group deleted successfully."

        });

    }

    catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};