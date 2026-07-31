const connectDatabase = require("../database");


async function columnExists(
    db,
    tableName,
    columnName
) {

    const columns =
        await db.all(
            `PRAGMA table_info(${tableName})`
        );


    return columns.some(
        column => column.name === columnName
    );

}



async function addColumnIfMissing(
    db,
    tableName,
    columnName,
    definition
) {


    const exists =
        await columnExists(
            db,
            tableName,
            columnName
        );


    if(!exists){

        console.log(
            `➕ Adding column ${columnName} to ${tableName}`
        );


        await db.exec(
            `
            ALTER TABLE ${tableName}
            ADD COLUMN ${columnName} ${definition}
            `
        );


    }

}



async function migrateGroups(){

    const db =
        await connectDatabase();


    console.log(
        "================================="
    );

    console.log(
        "AMS Group Migration Started"
    );

    console.log(
        "================================="
    );



    /*
    Add group_id to contacts table
    */

    await addColumnIfMissing(
        db,
        "contacts",
        "group_id",
        "INTEGER"
    );



    console.log(
        "================================="
    );

    console.log(
        "AMS Group Migration Completed"
    );

    console.log(
        "================================="
    );


}



module.exports = migrateGroups;