const connectDatabase = require("../database/database");

async function findByUsername(username) {
    const db = await connectDatabase();

    return db.get(
        "SELECT * FROM users WHERE username = ?",
        [username]
    );
}

async function createUser(username, passwordHash, role) {
    const db = await connectDatabase();

    return db.run(
        `INSERT INTO users(username,password_hash,role)
         VALUES(?,?,?)`,
        [username, passwordHash, role]
    );
}

module.exports = {
    findByUsername,
    createUser
};