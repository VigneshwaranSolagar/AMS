const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload.middleware");
const authenticate = require("../middleware/auth.middleware");
const contactController = require("../controllers/contact.controller");



router.get(
    "/",
    authenticate,
    contactController.getContacts
);



router.post(
    "/",
    authenticate,
    contactController.createContact
);



router.get(
    "/search",
    authenticate,
    contactController.searchContacts
);



// Import preview - reads only headers
router.post(
    "/import/preview",
    authenticate,
    upload.single("file"),
    contactController.previewImport
);



// Actual import
router.post(
    "/import",
    authenticate,
    upload.single("file"),
    contactController.importContacts
);



router.get(
    "/:id",
    authenticate,
    contactController.getContact
);



router.put(
    "/:id",
    authenticate,
    contactController.updateContact
);



router.delete(
    "/:id",
    authenticate,
    contactController.deleteContact
);



module.exports = router;