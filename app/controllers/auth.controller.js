const authService = require("../services/auth.service");

exports.login = async (req, res) => {

    const { username, password } = req.body;

    const result = await authService.login(
        username,
        password
    );

    if (!result) {
        return res.status(401).json({
            success: false,
            message: "Invalid username or password."
        });
    }

    return res.json({
        success: true,
        token: result.token,
        user: {
            id: result.user.id,
            username: result.user.username,
            role: result.user.role
        }
    });

};