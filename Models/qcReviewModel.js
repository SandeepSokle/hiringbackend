const mongoose = require("mongoose")

const schema = new mongoose.Schema({
   
    reviewData:{
        type:Array,
        status:String,
    }
},{timestamps:true})



const qcreview = mongoose.model("qcreview", schema);
module.exports = qcreview