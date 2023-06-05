const sampleModel = require("../Models/sampleModel")
const participantModel = require("../Models/participantModel")


exports.DeleteFile = async(req,res,next) =>{
 try{
    const {subjectDataId} = req.body;

    if(!subjectDataId) {
        return res.status(400).json({
            message:"Please Send All Required Field",
            status:false
        })
    }
    const IsUserFound = await sampleModel.findOneAndUpdate({"subjectData._id": subjectDataId}, { $pull :{"subjectData.$.file" : "show to sokle"}},{new:true})
    if(!IsUserFound){
     return res.status(400).json({
        message:"Does't Found Any User With That Id",
        status:false
     })
    }
    res.status(200).json({
        message:"file Deleted Successfully",
        status:true,
        data:IsUserFound
    })
 }
 catch(err){
    res.status(400).json({
        message:err.message,
        status:false
    })
 }
}


exports.AddSampleSubject = async(req,res,next) =>{

  try{
    const {subjectId,userId} = req.body;
    const IsUserAvailable = await sampleModel.findOne({userName:userId});

    var UploadfileData;
    if(IsUserAvailable){
        UploadfileData = await sampleModel.findByIdAndUpdate({_id : IsUserAvailable._id}, { $push : { subjectData : { subject : subjectId}}}, {new : true});
    }

    const addSubject = await participantModel.findOneAndUpdate({ _id: userId }, { $push: { subject: subjectId } }, { new: true });


    res.status(200).json({
        message:"subject Added Successfully",
        status:true
    })
  }
  catch(err){
    res.status(400).json({
        message:err.message,
        status:false
    })
  }
}

exports.AddFile = async(req,res,next)=>{


    try{
        const {FileUrl,subjectDataId} = req.body

        if(!FileUrl || !subjectDataId){
            return res.status(400).json({
                message:"Please Send All Required Field",
                status:false
            })
        }
    
        const IsFileAdded = await sampleModel.findOneAndUpdate({"subjectData._id": subjectDataId}, { $push :{"subjectData.$.file" : FileUrl }},{new:true});
    
        if(!IsFileAdded){
            return res.status(400).json({
                message:"Does't Found Any User With That Id",
                status:false
             })
        }
    
        res.status(200).json({
            message:"file Added Successfully",
            status:true,
            data:IsFileAdded
        })
    }
    catch(error){
        res.status(400).json({
            message:error.message,
            status:false
        })
    }

}
