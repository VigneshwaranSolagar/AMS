const connectDatabase = require("./app/database/database");

(async () => {

    try {

        const db = await connectDatabase();


        const migrations = [

            `
            ALTER TABLE campaigns
            ADD COLUMN attachment_name TEXT;
            `,

            `
            ALTER TABLE campaigns
            ADD COLUMN mime_type TEXT;
            `,

            `
            ALTER TABLE message_queue
            ADD COLUMN attachment TEXT;
            `,

            `
            ALTER TABLE message_queue
            ADD COLUMN attachment_type TEXT;
            `,

            `
            ALTER TABLE message_queue
            ADD COLUMN mime_type TEXT;
            `,

            `
            ALTER TABLE message_queue
            ADD COLUMN attachment_name TEXT;
            `

        ];


        for (const sql of migrations) {

            try {

                await db.exec(sql);

                console.log("✅ Column added");

            }
            catch (error) {

                if (
                    error.message.includes(
                        "duplicate column name"
                    )
                ) {

                    console.log(
                        "ℹ️ Column already exists"
                    );

                }
                else {

                    throw error;

                }

            }

        }


        console.log(
            "🎉 Attachment columns migration completed"
        );


        process.exit(0);


    }
    catch(error) {

        console.error(
            "Migration failed:",
            error
        );

        process.exit(1);

    }

})();