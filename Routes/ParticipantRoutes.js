const express = require("express");
const {createParticipant,deleteParticipant,removeSubjectInParticipant,getAllParticipant,SearchByName,FilterParticipentBySubject,getSingleParticipant,approveParticipantSubject,FilterParticipantByYears,addSubjectInPatricipant} = require("../Controllers/participant")
const router = express.Router();

router.route("/createparticipent").post(createParticipant)
router.route("/deleteparticipent").delete(deleteParticipant)
router.route("/getallparticipant").get(getAllParticipant)
router.route("/subjectfilter").post(FilterParticipentBySubject)
router.route("/getsingleparticipant").post(getSingleParticipant)
router.route("/yearfilter").post(FilterParticipantByYears)
router.route("/search").post(SearchByName)
router.route("/addsubjectinparticipant").put(addSubjectInPatricipant)
router.route("/removesubjectinparticipant").put(removeSubjectInParticipant)

module.exports = router