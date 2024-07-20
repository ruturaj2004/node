const mongoose = require("mongoose");

const privateWaterTaxSchema = new mongoose.Schema(
    {
        pipeSize: {
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
            },
        },
        subTaxType: {
            type: String,
            required: false,
            default:"private"
        },
        taxationPeriod: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "taxationPeriod",
            autopopulate: true,
        },
    },
    { timestamps: true }
);

privateWaterTaxSchema.plugin(require("mongoose-autopopulate"));

const privateWaterTaxModel = mongoose.model(
    "privateWaterTax",
    privateWaterTaxSchema
);
module.exports = privateWaterTaxModel;
