
const participantModel = require("../Models/participantModel")
const sampleModel = require("../Models/sampleModel")
exports.createParticipant = async (req, res, next) => {
    try {
        const { name, lastName, phoneNumber, email, experience, resume } = req.body;
        if (!name || !lastName || !phoneNumber || !email || !experience || !resume) {
            throw "Data Not Sended Completely"
        }

      var userData =   await participantModel.create({
            name,
            lastName,
            phoneNumber,
            email,
            experience,
            resume
        })

        var UploadfileData;
        console.log(userData,"userData");
        if(userData){
            UploadfileData = await sampleModel.create({
                userName : userData._id,
            })

        }
        userData = await participantModel.findByIdAndUpdate({_id : userData._id}, {
            $set : {samples : UploadfileData._id}
        }, {new : true})
      
        res.status(201).json({
            success: true,
            message: "Participant Created Successfully",
            user : userData
        })
    }
    catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        })
    }

}

exports.deleteParticipant = async (req, res, next) => {
    try {
        const { id } = req.query;

        if (id.length === 0) {
            return res.status(409).json({
                message: "Please Send ID first",
                status: false
            })
        }

        const isFound = await participantModel.findOneAndRemove({ _id: id })
        if (isFound.length === 0) {
            // throw 
            return res.status(409).json({
                message: "No Participend Found",
                success: false,
            })
        }

        res.status(200).json({
            message: "Participent Deleted Successfully",
            success: true,
        })
    }
    catch (err) {

        res.status(409).json({
            message: err.message,
            success: false,
        })
    }
}

exports.getAllParticipant = async (req, res, next) => {
    try {

        // const page = 1
        // const limit = 10

        // let skip = (page - 1) * limit;

        // const AllParticipantModel = await participantModel.find({}).skip(skip).limit(limit).sort({ "createdAt": -1 }).populate('subject');
        const AllParticipantModel = await participantModel.find({}).sort({ "createdAt": -1 }).populate('samples');
        if (AllParticipantModel.length === 0) {
            res.status(200).json({
                message: "No Participent Data Available",
                success: true,
            })
        }
        res.status(200).json({
            data: AllParticipantModel,
            message: "All Participent Data Available",
            success: true,
        })
    }
    catch (err) {
        res.status(400).json({
            error: err,
            success: false,
        })
    }

}

exports.getSingleParticipant = async (req, res, next) => {
    try {
        const { id } = req.body;

        if (id.length === 0 && !id) {
            res.status(409).json({
                message: "Please Send ID first",
                success: false,
            })
        }
        const user = await participantModel.findById({ _id: id })

        if (user.length === 0) {
            return res.status(409).json({
                message: "No Participend Found",
                success: false,
            })
        }

        res.status(200).json({
            Data: user,
            success: true,
        })
    }
    catch (err) {

        res.status(409).json({
            message: err.message,
            success: false,
        })
    }
}

exports.FilterParticipentBySubject = async (req, res, next) => {
    try {
        const { subject } = req.body;

        if (subject.length === 0) {
            return res.status(404).json({
                message: "Does't Support Blank Array",
                success: false,
            })
        }
        const page = 1
        const limit = 4

        let skip = (page - 1) * limit;

        let FilterParticipant = await participantModel.aggregate([
            {
                $lookup: {
                    from: "subjects",
                    localField: "subject",
                    foreignField: "_id",
                    as: "subject"
                }
            },
            {
                $match: {
                    "subject.subjectName": { $in: subject }
                }
            },
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: limit }
        ])

        res.status(200).json({
            success: true,
            data: FilterParticipant
        })
    }
    catch (err) {

        res.status(404).json({
            message: err.message,
            success: false,
        })
    }
}

exports.FilterParticipantByYears = async (req, res, next) => {
    try {
        const { year } = req.body;

        if (!year) {
            return res.status(301).json({
                message: "No data Send By front end",
                success: false,
            })
        }

        const AllData = await participantModel.find({ experience: year })

        res.status(200).json({
            success: true,
            data: AllData
        })
    }
    catch (err) {
        res.status(400).json({
            message: err.message,
            success: false,
        })
    }
}

exports.SearchByName = async (req, res, next) => {
    try {
        const { search } = req.body;

        if (search === undefined) {
            throw "Empty value Not Acceptable"
        }

        const response = await participantModel.aggregate([
            {
                $lookup: {
                    from: "subjects",
                    localField: "subject",
                    foreignField: "_id",
                    as: "subject"
                }
            },
            {
                $match: {
                    $or: [
                        { name: { $regex: search, $options: "i" } },
                        { lastName: { $regex: search, $options: "i" } },
                        { email: { $regex: search, $options: "i" } },
                        { phoneNumber: { $regex: search, $options: "i" } },
                        { "subject.subjectName": { $regex: search, $options: "i" } },
                    ],
                },
            }
        ])

        res.status(200).json({
            message: "data Found SuccessFully",
            data: response,
            status: true
        })
    }
    catch (err) {
        res.status(400).json({
            message: err.message,
            status: false
        })
    }

}

exports.approveParticipantSubject = async (req, res, next) => {
    try {
        const { subjectId, participantId, reviewBy, status, message } = req.body
        const AlreadyApproved = await participantModel.findOne({_id:participantId},{"review.subject":subjectId});
        if(AlreadyApproved){
            return res.status(400).json({
                message:"User Already Approved By Qc",
                success: false,
            })
        }
        const data = await participantModel.findOneAndUpdate({ _id: participantId },
            { $push: { review: { subject: subjectId, reviewBy: reviewBy, isApproved: status, message: message } } });

        if (!data) {
            return res.status(400).json({
                message: `subject Approved ${status} SuccessFully`,
                success: `${status}`,
            })
        }
        res.status(201).json({
            message: `subject Approved ${status} SuccessFully`,
            success: `${status}`,
        })
    }
    catch (err) {
        res.status(401).json({
            message: err.message,
            success: false,
        })

    }
}

exports.addSubjectInPatricipant = async (req, res, next) => {

 try{
    const { subjectId, userId } = req.body;

    if (!subjectId && !userId) {
        return res.status(400).json({
            message: "please Send subjectid and userid first",
            success: false,
        })
    }

    const IsuserFound = await participantModel.findOne({ _id: userId, subject: { $in: [subjectId] } });
    if (IsuserFound) {
        return res.status(404).json({
            success: false,
            message: "subject already present"
        })
    }

    //update the subject if that is not available in the list 
    const addSubject = await participantModel.findOneAndUpdate({ _id: userId }, { $push: { subject: subjectId } }, { new: true });

    if (!addSubject) {
        return res.status(400).json({
            success: false,
            message: "Not added"
        })
    }
    res.status(201).json({
        success: true,
        message: "SUBJECT ADDED",
        data: addSubject
    })
 }
 catch(err){
    res.status(400).json({
        message:err.message,
        success:false
    })
 }
}


exports.removeSubjectInParticipant = async(req,res,next) =>{

   try{
    const {userId,subjectId} = req.body

    if (!subjectId && !userId) {
        return res.status(400).json({
            message: "please Send subjectid and userid first",
            success:false
        })
    }
    const RemoveSubject = await participantModel.findOneAndUpdate({ _id: userId }, { $pull: { subject: subjectId } }, { new: true });
    if (RemoveSubject) {
        return res.status(200).json({
            success: true,
            message: "subject Deleted SucessFully"
        })
    }
   }
   catch(err){
    return res.status(409).json({
        success: false,
        message: err.message
    })
   }

}