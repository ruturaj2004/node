const mongoose = require("mongoose");

const gpPrivateWaterTaxSchema = new mongoose.Schema(
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
                    ref: "privateWaterTax",
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

gpPrivateWaterTaxSchema.plugin(require("mongoose-autopopulate"));

const gpPrivateWaterTaxModel = mongoose.model(
    "gpPrivateWaterTax",
    gpPrivateWaterTaxSchema
);
module.exports = gpPrivateWaterTaxModel;
