const mongoose = require("mongoose");

const WaterTaxRegistrationSchema = new mongoose.Schema(
    {
        gpId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "GramPanchayath",
            autopopulate: true,
            required: true,
        },
        citizenId: {
            type: Number,
            required: false,
        },
        propertyId:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"properties",
            autopopulate: true,
            required: false,
        }
    },
    { strict: false, timestamps: true }
);

const WaterTaxRegistrationModel = mongoose.model(
    "watertaxregistration",
    WaterTaxRegistrationSchema
);
module.exports = WaterTaxRegistrationModel;
