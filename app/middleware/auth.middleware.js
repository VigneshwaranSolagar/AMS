const jwt = require("jsonwebtoken");

function authenticate(req, res, next) {

    const header = req.headers.authorization;

    if (!header) {
        return res.status(401).json({
            success: false,
            message: "Authorization header missing."
        });
    }

    const token = header.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Token missing."
        });
    }

    try {

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = decoded;

        next();

    } catch {

        return res.status(401).json({
            success: false,
            message: "Invalid token."
        });
    }

}

module.exports = authenticate;