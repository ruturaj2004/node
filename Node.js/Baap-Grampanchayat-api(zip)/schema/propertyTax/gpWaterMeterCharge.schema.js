const mongoose = require("mongoose");

const GpWaterMeterChargeSchema = new mongoose.Schema(
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
        tax: [
            {
                type: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "WaterMeterCharge",
                    autopopulate: true,
                },
                value: {
                    type: Number,
                    required: true,
                },
            },
        ],
    },
    { timestamps: true }
);

GpWaterMeterChargeSchema.plugin(require("mongoose-autopopulate"));

const GpWaterMeterChargeModel = mongoose.model(
    "GpWaterMeterCharge",
    GpWaterMeterChargeSchema
);
module.exports = GpWaterMeterChargeModel;
