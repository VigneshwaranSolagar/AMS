const express = require("express");
const router = express.Router();

const authenticate = require("../middleware/auth.middleware");
const sender = require("../whatsapp/sender.service");

router.get("/test", (req, res) => {
    res.json({
        success: true,
        message: "WhatsApp route is working."
    });
});

router.post("/send", authenticate, async (req, res) => {

    try {

        await sender.sendText(
            req.body.phone,
            req.body.message
        );

        res.json({
            success: true,
            message: "Message sent."
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

});

console.log("✅ WhatsApp routes loaded");

module.exports = router;