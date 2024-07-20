const mongoose = require("mongoose");

const GpWaterConnectionTaxFeeSchema = new mongoose.Schema(
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
                    ref: "WaterConnectionTaxFee",
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

GpWaterConnectionTaxFeeSchema.plugin(require("mongoose-autopopulate"));

const GpWaterConnectionTaxFeeModel = mongoose.model(
    "GpWaterConnectionTaxFee",
    GpWaterConnectionTaxFeeSchema
);
module.exports = GpWaterConnectionTaxFeeModel;
