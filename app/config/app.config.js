require("dotenv").config();

module.exports = {

    PORT: process.env.PORT || 3000,

    NODE_ENV: process.env.NODE_ENV || "development",

    APP_NAME: process.env.APP_NAME || "AMS"

};