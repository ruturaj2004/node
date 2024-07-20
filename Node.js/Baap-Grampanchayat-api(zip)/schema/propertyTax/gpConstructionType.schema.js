const mongoose = require("mongoose");

const GpConstructionTypeSchema = new mongoose.Schema(
    {
        gpId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "GramPanchayath",
            // autopopulate: true,
        },
        taxationPeriod: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "taxationPeriod",
            autopopulate: true,
        },
        tax: [{
            type: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "constructionType",
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

GpConstructionTypeSchema.plugin(require('mongoose-autopopulate'));

const GpConstructionTypeModel = mongoose.model(
    "gpConstructionType",
    GpConstructionTypeSchema
);
module.exports = GpConstructionTypeModel;
