require("dotenv").config();
const express = require("express");
const cors = require("cors");

const path = require("path");  
const paths = require("../config/paths");
const licenseRoutes = require("../routes/license.routes");
const authRoutes = require("../routes/auth.routes");
const licenseGuard = require("../middleware/licenseGuard");

const contactRoutes = require("../routes/contact.routes");
const groupRoutes = require("../routes/group.routes");
const campaignRoutes = require("../routes/campaign.routes");
const templateRoutes = require("../routes/template.routes");
const queueRoutes = require("../routes/queue.routes");
const whatsappRoutes = require("../routes/whatsapp.routes");
const dashboardRoutes =require("../routes/dashboard.routes");
const campaignHistoryRoutes =require("../routes/campaignHistory.routes");
const reportsRoutes = require("../routes/reports.routes");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/license",licenseRoutes);
const uploadRoot = path.dirname(paths.templates);

console.log("STATIC UPLOAD ROOT:", uploadRoot);

app.use(
    "/uploads",
    licenseGuard,
    express.static(uploadRoot)
);
console.log("Serving uploads from:", paths.uploads);
app.get("/health", (req, res) => {
    res.json({
        status: "OK",
        application: "CampaignManager",
        version: "1.0.0",
        timestamp: new Date()
    });
});

app.use("/api/auth", authRoutes);
app.use("/api/contacts", licenseGuard,contactRoutes);
app.use("/api/groups", licenseGuard,groupRoutes);
app.use("/api/campaigns", licenseGuard,campaignRoutes);
app.use("/api/templates", licenseGuard,templateRoutes);
app.use("/api/queue", licenseGuard,queueRoutes);
app.use("/api/whatsapp", licenseGuard,whatsappRoutes);
app.use("/api/dashboard", licenseGuard,dashboardRoutes);
app.use("/api/campaign-history", licenseGuard,campaignHistoryRoutes);
app.use("/api/reports", licenseGuard, reportsRoutes);
module.exports = app;