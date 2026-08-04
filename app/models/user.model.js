const connectDatabase = require("../database/database");



async function findByUsername(username) {

    const db = await connectDatabase();

    return db.get(
        "SELECT * FROM users WHERE username = ?",
        [username]
    );

}




async function getUserCount() {

    const db = await connectDatabase();

    const result = await db.get(
        "SELECT COUNT(*) AS count FROM users"
    );

    return result.count;

}





async function createUser(data) {

    const db = await connectDatabase();


    const result = await db.run(

        `
        INSERT INTO users
        (
            username,
            password_hash,
            role,
            name,
            mobile,
            business_name,
            gst_pan
        )

        VALUES
        (?,?,?,?,?,?,?)

        `,

        [
            data.username,
            data.password_hash,
            data.role,
            data.name,
            data.mobile,
            data.business_name,
            data.gst_pan
        ]

    );


    return db.get(
        "SELECT * FROM users WHERE id = ?",
        [result.lastID]
    );

}





async function findByMobile(mobile) {

    const db = await connectDatabase();


    return db.get(

        "SELECT * FROM users WHERE mobile = ?",

        [mobile]

    );

}

async function findByGstPan(gst_pan) {

    const db = await connectDatabase();

    return db.get(

        "SELECT * FROM users WHERE gst_pan = ?",

        [gst_pan]

    );

}

async function updatePasswordByGstPan(
    gst_pan,
    password_hash
) {

    const db = await connectDatabase();

    return db.run(

        `
        UPDATE users
        SET password_hash = ?
        WHERE gst_pan = ?
        `,

        [
            password_hash,
            gst_pan
        ]

    );

}



async function updatePassword(
    mobile,
    password_hash
) {

    const db = await connectDatabase();


    return db.run(

        `
        UPDATE users
        SET password_hash = ?
        WHERE mobile = ?
        `,

        [
            password_hash,
            mobile
        ]

    );

}





module.exports = {

    findByUsername,

    getUserCount,

    createUser,

    findByMobile,

    findByGstPan,

    updatePassword,

    updatePasswordByGstPan

};