const dashboardModel = require("../models/dashboard.model");

async function getDashboardStats() {

    return await dashboardModel.getDashboardStats();

}

module.exports = {
    getDashboardStats
};