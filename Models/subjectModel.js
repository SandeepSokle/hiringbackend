const mongoose = require("mongoose")

const schema = new mongoose.Schema({
    subjectName: {
        type: String,
        unique: true,
        required: [true, "Please Enter Subject Name"],
    },

}, { timestamps: true })


const subjectModel = mongoose.model("subject", schema);
module.exports = subjectModel