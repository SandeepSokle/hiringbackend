const express = require("express");
const {createSubject,getAllSubject,editSubject,deleteSubject} = require('../Controllers/subject')
const router = express.Router();

router.route("/createsubject").post(createSubject)
router.route("/editsubject").put(editSubject)
router.route("/deletesubject").delete(deleteSubject)
router.route("/getallsubject").get(getAllSubject)



module.exports = router