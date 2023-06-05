
const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    userName: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "user"
    },
    
    subjectData:[ {
       subject : { type: mongoose.Schema.Types.ObjectId,
        required: true,
        default: null,
        ref: "subject"
       },

       file: {
        type: Array,
        required: false,
        default: null,
    }
    }]
}, { timestamps: true })


const sampleModel = mongoose.model("sample", schema);
module.exports = sampleModel