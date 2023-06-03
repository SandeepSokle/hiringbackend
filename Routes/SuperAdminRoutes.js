const express = require("express");
const {createSuperAdmin} = require("../Controllers/superAdmin")
const router = express.Router();

router.route("/createsuperadmin").post(createSuperAdmin)

module.exports = router