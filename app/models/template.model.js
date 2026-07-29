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
            created_by
        )
        VALUES (?,?,?,?)
        `,
        [
            template.template_name,
            template.category,
            template.message,
            template.created_by
        ]
    );

}

async function getAll() {

    const db = await connectDatabase();

    return db.all(
        `
        SELECT *
        FROM message_templates
        ORDER BY template_name
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
            message=?
        WHERE id=?
        `,
        [
            template.template_name,
            template.category,
            template.message,
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

module.exports = {

    create,

    getAll,

    getById,

    update,

    remove

};