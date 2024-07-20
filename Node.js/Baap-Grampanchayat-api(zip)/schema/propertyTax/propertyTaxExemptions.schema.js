const mongoose = require("mongoose");

const PropertyTaxExemptionSchema = new mongoose.Schema(
    {
        tax: {
            type: String,
            enum: ["Property", "Water", "Retail", "Health", "Light"],
            required: true
        },
        percentage: {
            type: Number,
            required: true
        }
    },
    { timestamps: true }
);

module.exports = PropertyTaxExemptionSchema;
