const mongoose = require("mongoose");

const GpWaterGeneralTaxSchema = new mongoose.Schema(
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
                    ref: "waterGeneralTax",
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

GpWaterGeneralTaxSchema.plugin(require("mongoose-autopopulate"));

const GpWaterGeneralTaxModel = mongoose.model(
    "gpWaterGeneralTax",
    GpWaterGeneralTaxSchema
);
module.exports = GpWaterGeneralTaxModel;
