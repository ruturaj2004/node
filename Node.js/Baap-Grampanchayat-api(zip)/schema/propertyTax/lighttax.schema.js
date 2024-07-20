const mongoose = require("mongoose");

const LightTaxSchema = new mongoose.Schema(
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
LightTaxSchema.plugin(require("mongoose-autopopulate"))
const LightTaxModel = mongoose.model("lighttax", LightTaxSchema);
module.exports = LightTaxModel;
