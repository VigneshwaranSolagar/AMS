const bcrypt = require("bcrypt");
const userModel = require("../models/user.model");

async function seedAdmin() {

    const admin = await userModel.findByUsername("admin");

    if (admin) {
        console.log("✅ Admin user already exists.");
        return;
    }

    const hash = await bcrypt.hash("admin123", 10);

    await userModel.createUser(
        "admin",
        hash,
        "Administrator"
    );

    console.log("✅ Default admin created.");
}

module.exports = seedAdmin;