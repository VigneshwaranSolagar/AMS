const express = require("express");

const router =
express.Router();

const controller =
require("../controllers/license.controller");


router.get(
    "/status",
    controller.status
);


router.get(
    "/fingerprint",
    controller.fingerprint
);


router.post(
    "/activate-key",
    controller.activateKey
);


module.exports = router;