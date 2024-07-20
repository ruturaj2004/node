const mongoose = require("mongoose");

const SignatureSampleApplicablePlaceSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        }
    },
    { timestamps: true }
);

const SignatureSampleApplicablePlaceModel = mongoose.model("signatureSampleApplicablePlace", SignatureSampleApplicablePlaceSchema);
module.exports = SignatureSampleApplicablePlaceModel;
