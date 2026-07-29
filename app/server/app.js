require("dotenv").config();
const express = require("express");
const cors = require("cors");

const authRoutes = require("../routes/auth.routes");
const contactRoutes = require("../routes/contact.routes");
const groupRoutes = require("../routes/group.routes");
const campaignRoutes = require("../routes/campaign.routes");
const templateRoutes = require("../routes/template.routes");
const queueRoutes = require("../routes/queue.routes");
const whatsappRoutes = require("../routes/whatsapp.routes");
const dashboardRoutes =require("../routes/dashboard.routes");
const campaignHistoryRoutes =require("../routes/campaignHistory.routes");
    
const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
    res.json({
        status: "OK",
        application: "CampaignManager",
        version: "1.0.0",
        timestamp: new Date()
    });
});

app.use("/api/auth", authRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/campaigns", campaignRoutes);
app.use("/api/templates", templateRoutes);
app.use("/api/queue", queueRoutes);
app.use("/api/whatsapp", whatsappRoutes);
app.use("/api/dashboard",dashboardRoutes);
app.use("/api/campaign-history",campaignHistoryRoutes);
module.exports = app;