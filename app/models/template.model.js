const connectDatabase = require("../database/database");



async function create(template) {

    const db = await connectDatabase();

    return db.run(

        `
        INSERT INTO message_templates
        (
            template_name,
            category,
            message,
            attachment,
            attachment_name,
            attachment_type,
            mime_type,
            file_size,
            created_by
        )
        VALUES
        (
            ?,?,?,?,?,?,?,?,?
        )
        `,

        [

            template.template_name,

            template.category,

            template.message,

            template.attachment || null,

            template.attachment_name || null,

            template.attachment_type || null,

            template.mime_type || null,

            template.file_size || null,

            template.created_by

        ]

    );

}





async function getAll() {

    const db = await connectDatabase();

    return db.all(

        `
        SELECT

            id,

            template_name,

            category,

            message,

            attachment,

            attachment_name,

            attachment_type,

            mime_type,

            file_size,

            created_at

        FROM message_templates

        ORDER BY

            template_name ASC

        `

    );

}





async function getById(id) {

    const db = await connectDatabase();

    return db.get(

        `
        SELECT *

        FROM message_templates

        WHERE id=?

        `,

        [id]

    );

}





async function update(id, template) {

    const db = await connectDatabase();

    return db.run(

        `
        UPDATE message_templates

        SET

            template_name=?,

            category=?,

            message=?,

            attachment=?,

            attachment_name=?,

            attachment_type=?,

            mime_type=?,

            file_size=?

        WHERE

            id=?

        `,

        [

            template.template_name,

            template.category,

            template.message,

            template.attachment || null,

            template.attachment_name || null,

            template.attachment_type || null,

            template.mime_type || null,

            template.file_size || null,

            id

        ]

    );

}





async function remove(id) {

    const db = await connectDatabase();

    return db.run(

        `
        DELETE

        FROM message_templates

        WHERE id=?

        `,

        [id]

    );

}





async function removeAttachment(id) {

    const db = await connectDatabase();

    return db.run(

        `
        UPDATE message_templates

        SET

            attachment=NULL,

            attachment_name=NULL,

            attachment_type=NULL,

            mime_type=NULL,

            file_size=NULL

        WHERE id=?

        `,

        [id]

    );

}





module.exports = {

    create,

    getAll,

    getById,

    update,

    remove,

    removeAttachment

};