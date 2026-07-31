const connectDatabase = require("../database");

async function migrate() {

    const db = await connectDatabase();

    try {

        console.log("=================================");
        console.log("Template Attachment Migration");
        console.log("=================================\n");

        const columns = await db.all(

            `
            PRAGMA table_info(message_templates)
            `

        );

        const existingColumns =
            columns.map(
                column => column.name
            );

        async function addColumn(name, definition) {

            if (existingColumns.includes(name)) {

                console.log(`✓ ${name} already exists`);

                return;

            }

            await db.exec(

                `
                ALTER TABLE message_templates
                ADD COLUMN ${name} ${definition}
                `

            );

            console.log(`✓ Added ${name}`);

        }

        await addColumn(
            "attachment",
            "TEXT"
        );

        await addColumn(
            "attachment_name",
            "TEXT"
        );

        await addColumn(
            "attachment_type",
            "TEXT"
        );

        await addColumn(
            "mime_type",
            "TEXT"
        );

        await addColumn(
            "file_size",
            "INTEGER"
        );

        console.log("\n=================================");
        console.log("Migration completed successfully.");
        console.log("=================================");

    }

    catch (error) {

        console.error("\nMigration failed:\n");

        console.error(error);

    }

    finally {

        await db.close();

    }

}

migrate();