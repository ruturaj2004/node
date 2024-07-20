const mongoose = require("mongoose");

const WaterConnectionTaxFeeSchema = new mongoose.Schema(
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

WaterConnectionTaxFeeSchema.plugin(require("mongoose-autopopulate"));

const WaterConnectionTaxFeeModel = mongoose.model(
    "WaterConnectionTaxFee",
    WaterConnectionTaxFeeSchema
);
module.exports = WaterConnectionTaxFeeModel;
