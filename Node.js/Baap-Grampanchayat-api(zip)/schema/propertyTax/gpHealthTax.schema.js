const mongoose = require("mongoose");

const GpHealthTaxSchema = new mongoose.Schema(
    {
        gpId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "GramPanchayath",
        },
        taxationPeriod: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "taxationPeriod",
            autopopulate: true,
        },
        tax: [{
            type: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "healthTax",
                autopopulate: true,
            },
            value: {
                type: Number,
                required: true
            },
        }],
    },
    { timestamps: true }
);


GpHealthTaxSchema.plugin(require('mongoose-autopopulate'));

const GpHealthTaxModel = mongoose.model(
    "gpHealthTax",
    GpHealthTaxSchema
);
module.exports = GpHealthTaxModel;
