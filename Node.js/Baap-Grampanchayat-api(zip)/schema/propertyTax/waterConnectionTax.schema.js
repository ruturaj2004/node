const mongoose = require("mongoose");

const WaterConnectionTaxSchema = new mongoose.Schema(
    {
        usageType: {
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
        taxationPeriod: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "taxationPeriod",
            autopopulate: true,
        },
    },
    { timestamps: true }
);

WaterConnectionTaxSchema.plugin(require("mongoose-autopopulate"));

const WaterConnectionTaxModel = mongoose.model(
    "WaterConnectionTax",
    WaterConnectionTaxSchema
);
module.exports = WaterConnectionTaxModel;
