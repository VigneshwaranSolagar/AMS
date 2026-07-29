const connectDatabase = require("./database/database");

async function createGroups() {

    const db = await connectDatabase();

    const groups = [
        {
            group_name: "VIP",
            description: "VIP Customers"
        },
        {
            group_name: "Retail",
            description: "Retail Customers"
        },
        {
            group_name: "Premium",
            description: "Premium Customers"
        }
    ];


    for (const group of groups) {

        await db.run(
            `
            INSERT OR IGNORE INTO contact_groups
            (
                group_name,
                description
            )
            VALUES (?,?)
            `,
            [
                group.group_name,
                group.description
            ]
        );

    }


    console.log("✓ Groups created.");

}

createGroups()
.catch(console.error);