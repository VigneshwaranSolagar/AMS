const express = require("express");

const router = express.Router();

const authenticate = require("../middleware/auth.middleware");

const groupController = require("../controllers/group.controller");

router.post(
    "/",
    authenticate,
    groupController.createGroup
);

router.get(
    "/",
    authenticate,
    groupController.getGroups
);

router.get(
    "/:id",
    authenticate,
    groupController.getGroup
);

router.put(
    "/:id",
    authenticate,
    groupController.updateGroup
);

router.delete(
    "/:id",
    authenticate,
    groupController.deleteGroup
);

module.exports = router;