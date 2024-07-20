const mongoose = require("mongoose");

const gpLightTaxSchema = new mongoose.Schema(
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
                    ref: "lighttax",
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

gpLightTaxSchema.plugin(require("mongoose-autopopulate"));

const gpLightTaxModel = mongoose.model("gpLightTax", gpLightTaxSchema);
module.exports = gpLightTaxModel;
