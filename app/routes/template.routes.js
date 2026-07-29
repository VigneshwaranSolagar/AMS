const express = require("express");

const router = express.Router();

const authenticate = require("../middleware/auth.middleware");

const templateController = require("../controllers/template.controller");

router.post(
    "/",
    authenticate,
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
    templateController.updateTemplate
);

router.delete(
    "/:id",
    authenticate,
    templateController.deleteTemplate
);

module.exports = router;