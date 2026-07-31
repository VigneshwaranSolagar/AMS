const contactModel = require("../models/contact.model");
const validateContact = require("../validators/contact.validator");
const importService = require("../services/import.service");
exports.createContact = async (req, res) => {

    try {
        const errors = validateContact(req.body);

if (errors.length > 0) {
    return res.status(400).json({
        success: false,
        errors
    });
}
        const result = await contactModel.create(req.body);

        res.status(201).json({
            success: true,
            message: "Contact created successfully.",
            id: result.lastID
        });

    } catch (err) {

    if (err.message.includes("UNIQUE constraint failed")) {
        return res.status(409).json({
            success: false,
            message: "A contact with this phone number already exists."
        });
    }

    res.status(500).json({
        success: false,
        message: err.message
    });

}

};

exports.getContacts = async (req, res) => {

    try {

        const { group_id, search } = req.query;

        const contacts = await contactModel.getAll(group_id, search);

        res.json({
            success: true,
            data: contacts
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};
exports.getContact = async (req, res) => {

    const contact = await contactModel.getById(req.params.id);

    if (!contact) {
        return res.status(404).json({
            success: false,
            message: "Contact not found."
        });
    }

    res.json({
        success: true,
        data: contact
    });

};

exports.updateContact = async (req, res) => {
    const errors = validateContact(req.body);

if (errors.length > 0) {
    return res.status(400).json({
        success: false,
        errors
    });
}
    await contactModel.update(req.params.id, req.body);

    res.json({
        success: true,
        message: "Contact updated."
    });

};

exports.deleteContact = async (req, res) => {

    await contactModel.remove(req.params.id);

    res.json({
        success: true,
        message: "Contact deleted."
    });

};

exports.searchContacts = async (req, res) => {

    const q = req.query.q || "";

    const contacts = await contactModel.search(q);

    res.json({
        success: true,
        total: contacts.length,
        data: contacts
    });

};

exports.importContacts = async (req, res) => {

    try {


        if (!req.file) {

            return res.status(400).json({

                success: false,

                message: "Import file is required."

            });

        }



        const mapping =
            JSON.parse(
                req.body.mapping || "{}"
            );



        if (!mapping.phone) {

            return res.status(400).json({

                success:false,

                message:
                "Mobile Number mapping is required."

            });

        }



        const result =
            await importService.importContacts(

                req.file.path,

                mapping

            );



        res.json({

            success:true,

            ...result

        });


    }


    catch(err) {


        console.error(err);


        res.status(500).json({

            success:false,

            message:err.message

        });


    }

};

exports.previewImport = async (req, res) => {

    try {

        if (!req.file) {

            return res.status(400).json({
                success: false,
                message: "File is required."
            });

        }


        const headers =
            await importService.previewHeaders(
                req.file.path
            );


        res.json({

            success: true,

            headers

        });


    }

    catch (err) {

        console.error(err);

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

exports.removeFromGroup = async (req, res) => {

    try {

        await contactModel.updateGroup(
            req.params.id,
            null
        );


        res.json({
            success:true,
            message:"Contact removed from group."
        });


    }
    catch(err){

        res.status(500).json({

            success:false,

            message:err.message

        });

    }

};

