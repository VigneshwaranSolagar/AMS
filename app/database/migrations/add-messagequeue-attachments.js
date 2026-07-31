const connectDatabase =
    require("../database");

async function migrate() {

    const db =
        await connectDatabase();

    try {

        await db.exec(`

            ALTER TABLE message_queue
            ADD COLUMN attachment TEXT;

        `);

        console.log(
            "✅ attachment added"
        );

    } catch (err) {

        console.log(
            "attachment already exists."
        );

    }



    try {

        await db.exec(`

            ALTER TABLE message_queue
            ADD COLUMN attachment_name TEXT;

        `);

        console.log(
            "✅ attachment_name added"
        );

    } catch (err) {

        console.log(
            "attachment_name already exists."
        );

    }



    try {

        await db.exec(`

            ALTER TABLE message_queue
            ADD COLUMN attachment_type TEXT;

        `);

        console.log(
            "✅ attachment_type added"
        );

    } catch (err) {

        console.log(
            "attachment_type already exists."
        );

    }



    try {

        await db.exec(`

            ALTER TABLE message_queue
            ADD COLUMN mime_type TEXT;

        `);

        console.log(
            "✅ mime_type added"
        );

    } catch (err) {

        console.log(
            "mime_type already exists."
        );

    }



    console.log(
        "\n🎉 Message Queue migration completed successfully."
    );

    process.exit();

}

migrate();