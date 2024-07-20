const mongoose = require("mongoose");

const WaterGeneralTaxSchema = new mongoose.Schema(
    {
        propertyArea: {
            min: {
                type: Number,
                required: false,
                // unique: true
            },
            max: {
                type: Number,
                required: false,
                // unique: true
            },
        },
        tax: {
            min: {
                type: Number,
                required: true,
            },
            max: {
                type: Number,
                required: true,
            },
        },
        taxationPeriod: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "taxationPeriod",
            autopopulate: true,
        },
    },
    { timestamps: true }
);

WaterGeneralTaxSchema.plugin(require("mongoose-autopopulate"));

const WaterGeneralTaxModel = mongoose.model(
    "waterGeneralTax",
    WaterGeneralTaxSchema
);
module.exports = WaterGeneralTaxModel;
