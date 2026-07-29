const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userModel = require("../models/user.model");

async function login(username, password) {

    const user = await userModel.findByUsername(username);

    if (!user)
        return null;

    const valid = await bcrypt.compare(
        password,
        user.password_hash
    );

    if (!valid)
        return null;

    const token = jwt.sign(
        {
            id: user.id,
            username: user.username,
            role: user.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "8h"
        }
    );

    return {
        token,
        user
    };

}

module.exports = {
    login
};