const mongoose = require("mongoose");

const GpTaxMasterDataSchema = new mongoose.Schema(
    {
        haveSurveyNumbers: {
            type: Boolean,
            required: true,
        },

        landRate: {
            type: Number,
            required: true,
        },
        SurveyNumbers: [
            {
                SurveyNumbers: {
                    type: String,
                    required: true,
                },
                landRate: {
                    type: Number,
                    required: true,
                },
            },
        ],
        taxationPeriod: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "taxationPeriod",
            autopopulate: true,
        },
        gpId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "GramPanchayath",
            autopopulate: true,
        },
        tribalVillage:{
            type:Boolean,
            required: true,

        }
    },
    { strict: false, timestamps: true }
);

GpTaxMasterDataSchema.plugin(require("mongoose-autopopulate"));
const GpTaxMasterDataModel = mongoose.model(
    "gpTaxMasterData",
    GpTaxMasterDataSchema
);
module.exports = GpTaxMasterDataModel;
