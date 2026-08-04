const runtimeConfig =
    require("./runtime.config");


module.exports = {

    SECRET:
        runtimeConfig.JWT_SECRET

};