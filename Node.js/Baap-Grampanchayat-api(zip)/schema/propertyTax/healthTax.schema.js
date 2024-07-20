const mongoose = require("mongoose");

const HealthTaxSchema = new mongoose.Schema(
    {
        propertyArea: {
            min: {
                type: Number,
                required: true,
                // unique: true
            },
            max: {
                type: Number,
                required: true,
                // unique: true
            }
        },
        tax: {
            min: {
                type: Number,
                required: true,
            },
            max: {
                type: Number,
                required: true,
            }
        },
        taxationPeriod: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "taxationPeriod",
            autopopulate: true,
        },
    },
    { timestamps: true }
);


HealthTaxSchema.plugin(require('mongoose-autopopulate'));

const HealthTaxModel = mongoose.model(
    "healthTax",
    HealthTaxSchema
);
module.exports = HealthTaxModel;
