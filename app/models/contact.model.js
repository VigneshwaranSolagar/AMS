const connectDatabase = require("../database/database");



async function getGroupId(db, groupName) {

    if (!groupName || groupName.trim() === "") {

        return null;

    }

    const existing = await db.get(

        `
        SELECT id
        FROM contact_groups
        WHERE LOWER(group_name)=LOWER(?)
        `,

        [groupName.trim()]

    );

    if (existing) {

        return existing.id;

    }

    const result = await db.run(

        `
        INSERT INTO contact_groups
        (
            group_name
        )
        VALUES(?)
        `,

        [groupName.trim()]

    );

    return result.lastID;

}



async function create(contact) {

    const db = await connectDatabase();

    const groupId =
        await getGroupId(
            db,
            contact.group_name
        );

    return db.run(

        `
        INSERT INTO contacts
        (
            first_name,
            last_name,
            phone,
            email,
            company,
            tags,
            group_id,
            notes
        )
        VALUES(?,?,?,?,?,?,?,?)
        `,

        [

            contact.first_name,

            contact.last_name,

            contact.phone,

            contact.email,

            contact.company,

            contact.tags,

            groupId,

            contact.notes || null

        ]

    );

}



async function getAll() {

    const db = await connectDatabase();

    return db.all(

        `
        SELECT

            contacts.*,

            contact_groups.group_name

        FROM contacts

        LEFT JOIN contact_groups

        ON contacts.group_id = contact_groups.id

        ORDER BY contacts.first_name

        `

    );

}



async function getById(id) {

    const db = await connectDatabase();

    return db.get(

        `
        SELECT

            contacts.*,

            contact_groups.group_name

        FROM contacts

        LEFT JOIN contact_groups

        ON contacts.group_id = contact_groups.id

        WHERE contacts.id = ?

        `,

        [id]

    );

}



async function search(query) {

    const db = await connectDatabase();

    return db.all(

        `
        SELECT

            contacts.*,

            contact_groups.group_name

        FROM contacts

        LEFT JOIN contact_groups

        ON contacts.group_id = contact_groups.id

        WHERE

            contacts.first_name LIKE ?

            OR contacts.last_name LIKE ?

            OR contacts.phone LIKE ?

            OR contacts.email LIKE ?

            OR contacts.company LIKE ?

            OR contacts.tags LIKE ?

            OR contact_groups.group_name LIKE ?

        ORDER BY contacts.first_name

        `,

        [

            `%${query}%`,

            `%${query}%`,

            `%${query}%`,

            `%${query}%`,

            `%${query}%`,

            `%${query}%`,

            `%${query}%`

        ]

    );

}



async function update(id, contact) {

    const db = await connectDatabase();

    const groupId =
        await getGroupId(
            db,
            contact.group_name
        );

    return db.run(

        `
        UPDATE contacts

        SET

            first_name=?,

            last_name=?,

            phone=?,

            email=?,

            company=?,

            tags=?,

            group_id=?,

            notes=?

        WHERE id=?

        `,

        [

            contact.first_name,

            contact.last_name,

            contact.phone,

            contact.email,

            contact.company,

            contact.tags,

            groupId,

            contact.notes || null,

            id

        ]

    );

}



async function remove(id) {

    const db = await connectDatabase();

    return db.run(

        `
        DELETE FROM contacts
        WHERE id=?
        `,

        [id]

    );

}



async function getByGroupId(groupId) {

    const db = await connectDatabase();

    return db.all(

        `
        SELECT

            contacts.*,

            contact_groups.group_name

        FROM contacts

        LEFT JOIN contact_groups

        ON contacts.group_id = contact_groups.id

        WHERE contacts.group_id=?

        ORDER BY contacts.first_name

        `,

        [groupId]

    );

}



module.exports = {

    create,

    getAll,

    getById,

    update,

    remove,

    search,

    getByGroupId

};