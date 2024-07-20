const mongoose = require("mongoose");

const WaterMeterChargeSchema = new mongoose.Schema(
    {
        usageType: {
            type: String,
            required: true,
            // unique: true,
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

WaterMeterChargeSchema.plugin(require("mongoose-autopopulate"));

const WaterMeterChargeModel = mongoose.model(
    "WaterMeterCharge",
    WaterMeterChargeSchema
);
module.exports = WaterMeterChargeModel;
