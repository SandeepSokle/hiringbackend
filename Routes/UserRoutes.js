const express = require("express");
const {CreateUser,getAllUsers,deleteUser,sendMail,sendMessageToPhone,userLogin} = require("../Controllers/users")
const{approveParticipantSubject} = require("../Controllers/participant")
const router = express.Router();

router.route("/createuser").post(CreateUser) 
router.route("/getalluser").get(getAllUsers)
router.route("/login").post(userLogin)
router.route("/deleteuser").post(deleteUser)
router.route("/mail").get(sendMail)
router.route("/approvesubject").post(approveParticipantSubject)
router.route("/message").get(sendMessageToPhone)
module.exports = router