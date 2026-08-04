const express = require("express");

const router =
express.Router();

const controller =
require("../controllers/license.controller");

const upload =
    require("../middleware/licenseUpload");

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

router.post(

    "/import",

    upload.single("license"),

    controller.importLicense

);

module.exports = router;