const express = require("express");
const {UploadFile,DeleteFile, AddFile,AddSampleSubject} = require("../Controllers/sample")
const router = express.Router();

// router.route("/uploadfile").post(UploadFile);
router.route("/deletefile").put(DeleteFile);
router.route("/addfile").put(AddFile);
router.route("/addsamplesubject").put(AddSampleSubject)

module.exports = router