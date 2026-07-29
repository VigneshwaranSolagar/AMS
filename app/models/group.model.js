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
        SELECT *
        FROM contact_groups
        ORDER BY group_name
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