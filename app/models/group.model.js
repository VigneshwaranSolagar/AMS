const connectDatabase = require("../database/database");

async function create(group) {

    const db = await connectDatabase();

    return db.run(
        `
        INSERT INTO contact_groups
        (
            group_name,
            description
        )
        VALUES (?, ?)
        `,
        [
            group.group_name,
            group.description
        ]
    );

}



async function getAll() {

    const db = await connectDatabase();

    return db.all(
        `
        SELECT

            contact_groups.id,

            contact_groups.group_name,

            contact_groups.description,

            contact_groups.created_at,

            COUNT(contacts.id) AS contact_count

        FROM contact_groups

        LEFT JOIN contacts

        ON contacts.group_id = contact_groups.id

        GROUP BY contact_groups.id

        ORDER BY contact_groups.group_name

        `
    );

}



async function getById(id) {

    const db = await connectDatabase();

    return db.get(
        `
        SELECT *
        FROM contact_groups
        WHERE id = ?
        `,
        [id]
    );

}



async function update(id, group) {

    const db = await connectDatabase();

    return db.run(
        `
        UPDATE contact_groups
        SET
            group_name = ?,
            description = ?
        WHERE id = ?
        `,
        [
            group.group_name,
            group.description,
            id
        ]
    );

}



async function remove(id) {

    const db = await connectDatabase();

    return db.run(
        `
        DELETE
        FROM contact_groups
        WHERE id = ?
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