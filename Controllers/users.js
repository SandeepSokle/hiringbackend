const userModel = require("../Models/UserModel");
// const twilio = require('twilio')(process.env.SID,process.env.AUTH_TOKEN)
const bcrypt = require("bcrypt")
const nodemailer = require("nodemailer");
exports.CreateUser = async (req, res, next) => {

    try {
        const { name, lastName, email, password, role, phoneNumber, subjectType } = req.body;

        if( !name || !lastName || !email || !password || !role || !phoneNumber || !subjectType )
        {
            return res.status(400).json({
                message:"Please Send All Field",
                status:false
            })
        }

        const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(password,salt);

      const user = await userModel.create({
            name,
            lastName,
            email,
           password: secPass,
            role,
            phoneNumber,
            subjectType
        })

        res.status(200).json({
            message: "QC User Created Successfully",
            success: true,
            status: 200
        })

    }
    catch (err) {
        if (err.code === 11000) {
            res.status(409).json({
                status: false,
                error: "User already exist!!"
            })
        }
        else {
            res.status(500).json({
                status: false,
                error: err.message
            })
        }
    }
}

exports.getAllUsers = async (req, res, next) => {
    try {
     
        const isUserFound = await userModel.find().populate('subjectType');
        if (!isUserFound) {
            throw "No User Data Available"
        }
        res.status(200).json({
            Data: isUserFound,
            status: true,
        })
    }
    catch (err) {
        res.status(400).json({
            message: err.message,
            status: false
        })
    }
}

exports.deleteUser = async (req, res, next) => {
    try {

        const { userId } = req.body;
        if (!userId) {
            throw "please Send User Info Properly"
        }
        const deleteUser = await userModel.findByIdAndRemove({ _id: userId })
        console.log(deleteUser, "deleteuser");

        if (!deleteUser) {
            throw "No Qc Found In DataBase For this Name"
        }

        res.status(201).json({
            message: "QC Deleted SuccessFully",
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

exports.sendMail = async(req,res,next) =>{

    const generatedOtp = await GenrateOtp();
    console.log(generatedOtp,"generatedOtp");

    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        auth: {
            user: 'ajaydholia19@gmail.com',
            pass: 'cwumipfhpszaiqzq'
        },
      });


      let info = await transporter.sendMail({
        from: '"Ajay Dholia👻" <ajaydholia@gmail.com>', // sender address
        to: ["garvmehta7701@gmail.com","ajaydholia19@gmail.com"], // list of receivers
        subject: "Hello Dholia ", // Subject line
        html: `<b>Hello Dholia ${generatedOtp}?</b>`, // html body
      });


      res.json({
        message:"Mail has Been Sended SuccessFully",
        response:true
      })
}

exports.sendMessageToPhone = async(req,res,next)=>{

    // twilio.messages.create({
    //     from:"+13203318188",
    //     username:"ajay",
    //     to:"+918059070534",
    //     body:"this is a testing Message"
    // }).then((res)=>(console.log(res,'message has been send')))
    // .catch((e)=>(console.log(e,"e")))
}

exports.userLogin = async(req,res,next)=>{
    const {phoneNumber,password} = req.body

    if(!phoneNumber || !password){
        return res.status(400).json({
            message:"Phone Number Or Password required",
            status:false
        })
    }


    const user = await userModel.findOne({phoneNumber})

    console.log(user,"user data");
    if(!user){
        return res.status(400).json({
            message:"Phone Number or Password Wrong",
            status:false
        })
    }

    console.log(user.password , password , "password ");
     const isPasswordMatch  = await bcrypt.compare(password,user.password);
    if(!isPasswordMatch){
       return res.status(400).json({
            message:"Password Must Match",
            status:false
        })
    }


res.status(200).json({
    message:"Login Successfull",
    data:user,
    status:true
})

}

const GenrateOtp = async() =>{
    let digit = '0123456789'
    var OTP = ""

    for(let i = 0; i < 4; i++){
        OTP += digit[(Math.floor(Math.random()*10))];
    }

return OTP
}