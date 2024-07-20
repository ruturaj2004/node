const mongoose = require("mongoose");

const SignatureSampleSchema = new mongoose.Schema(
    {
        gpId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "GramPanchayath",
            autopopulate: true,
        },

        post: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "staffPost",
            autopopulate: true,
        },
        officerName: {
            type: String,
            required: true,
        },
        appliedOn: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "signatureSampleApplicablePlace",
                autopopulate: true,
            },
        ],
        signUrl: {
            type: String,
            required: true,
        },
    },
    { timestamps: true, strict: false }
);
SignatureSampleSchema.plugin(require("mongoose-autopopulate"));
const SignatureSampleModel = mongoose.model(
    "signatureSample",
    SignatureSampleSchema
);
module.exports = SignatureSampleModel;
