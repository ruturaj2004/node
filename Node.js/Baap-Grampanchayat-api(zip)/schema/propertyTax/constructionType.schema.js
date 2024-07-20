const mongoose = require("mongoose");

const ConstructionTypeSchema = new mongoose.Schema(
    {
        type: {
            type: String,
            required: true,
            // unique: true
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
        constructionRatePerSqMeter: {
            type: Number,
            required: true,
        },
        taxationPeriod: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "taxationPeriod",
            autopopulate: true,
        },
        depreciation : [{
            yearsFrom: {
                type: Number,
                required: true,
            },
            yearsTo: {
                type: Number,
                required: true,
            },
            value: {
                type: Number,
                required: true,
            }
        }]
    },
    { timestamps: true }
);


ConstructionTypeSchema.plugin(require('mongoose-autopopulate'));

const ConstructionTypeModel = mongoose.model(
    "constructionType",
    ConstructionTypeSchema
);
module.exports = ConstructionTypeModel;
