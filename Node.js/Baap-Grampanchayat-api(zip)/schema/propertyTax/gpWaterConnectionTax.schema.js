const mongoose = require("mongoose");

const GpWaterConnectionTaxSchema = new mongoose.Schema(
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
                    ref: "WaterConnectionTax",
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

GpWaterConnectionTaxSchema.plugin(require("mongoose-autopopulate"));

const GpWaterConnectionTaxModel = mongoose.model(
    "GpWaterConnectionTax",
    GpWaterConnectionTaxSchema
);
module.exports = GpWaterConnectionTaxModel;
