const express = require("express");
const {UploadFile,DeleteFile, AddFile} = require("../Controllers/sample")
const router = express.Router();

router.route("/uploadfile").post(UploadFile);
router.route("/deletefile").put(DeleteFile);
router.route("/addfile").put(AddFile);

module.exports = router