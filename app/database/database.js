const sqlite3 = require("sqlite3");
const { open } = require("sqlite");

const dbConfig = require("../config/db.config");

async function connectDatabase() {

    return open({

        filename: dbConfig.DATABASE,

        driver: sqlite3.Database

    });

}

module.exports = connectDatabase;