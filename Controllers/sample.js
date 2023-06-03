const sampleModel = require("../Models/sampleModel")
exports.UploadFile = async(req,res,next)=>{
    try{

        const filestringdata = ["shhashgkasgajsgkasg","shhashgkasgajsgkasg","sgfjsagghaskhgd","hdshkasjywuwfsdhksdf","shfkjkfs"]
        const {subjectId,userId} = req.body;

        if(!subjectId,!userId){
            return res.status(409).json({
                message:"Please Send All Required Field",
               status:false  
            })
        }

        // const UploadfileData = await sampleModel.create({
        //     userName : userId,
        //    subjectData :
        //         {
        //             subject:subjectId,
        //         file:filestringdata
        //     }
            
        // })
        // res.status(200).json({
        //     message:"Your Data Has Been Uploaded SuccessFully",
        //     status:true,
        //     data:UploadfileData
        // })
    }
    catch(err){
        res.status(400).json({
            message:err.message,
            status:false
        })
    }
}



exports.DeleteFile = async(req,res,next) =>{
 try{
    const {userId,subjectId} = req.body;

    if(!subjectId) {
        return res.status(400).json({
            message:"Please Send All Required Field",
            status:false
        })
    }
    const IsUserFound = await sampleModel.findOneAndUpdate({"subjectData._id": subjectId}, { $pull :{"subjectData.$.file" : "Ajay N Update Kiya h"}},{new:true})
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



exports.AddFile = async(req,res,next)=>{

    const {FileUrl,subjectId} = req.body

    if(!FileUrl || !subjectId){
        return res.status(400).json({
            message:"Please Send All Required Field",
            status:false
        })
    }

    const IsFileAdded = await sampleModel.findOneAndUpdate({"subjectData._id": subjectId}, { $push :{"subjectData.$.file" : "Ajay N Update Kiya h"}},{new:true});

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
