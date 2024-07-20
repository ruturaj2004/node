const mongoose = require("mongoose");

const GpSurvayNumberDetailsSchema = new mongoose.Schema(
    {
        number: {
            type: String,
            required: true,
        },
        gpId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "GramPanchayath",
            autopopulate: true,
        },

        landRate: {
            type: Number,
            required: true,
        },
        taxationPeriod: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "taxationPeriod",
            autopopulate: true,
            required: false,
        },
    },
    { timestamps: true }
);

GpSurvayNumberDetailsSchema.plugin(require("mongoose-autopopulate"));

const GpSurvayNumberDetailsModel = mongoose.model(
    "gpSurvayNumberDetails",
    GpSurvayNumberDetailsSchema
);
module.exports = GpSurvayNumberDetailsModel;
