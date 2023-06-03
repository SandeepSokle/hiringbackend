const mongoose = require("mongoose")

const schema = new mongoose.Schema({
  otpData: {
    type: Number,
    required: true,
  },

}, { timestamps: true })

schema.index(
  { createdAt: 1 },
  {
    expireAfterSeconds: 60,
    partialFilterExpression: { isValidated: false },
  }
);

const otpModel = mongoose.model("otp", schema);
module.exports = otpModel