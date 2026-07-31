const express = require("express");

const router = express.Router();

const authenticate =
    require("../middleware/auth.middleware");

const upload =
    require("../middleware/template-upload.middleware");

const templateController =
    require("../controllers/template.controller");



router.post(
    "/",
    authenticate,
    upload.single("attachment"),
    templateController.createTemplate
);



router.get(
    "/",
    authenticate,
    templateController.getTemplates
);



router.get(
    "/:id",
    authenticate,
    templateController.getTemplate
);



router.put(
    "/:id",
    authenticate,
    upload.single("attachment"),
    templateController.updateTemplate
);



router.delete(
    "/:id",
    authenticate,
    templateController.deleteTemplate
);

router.post(
    "/test-send",
    upload.single("attachment"),
    templateController.sendTestMessage
);

module.exports = router;