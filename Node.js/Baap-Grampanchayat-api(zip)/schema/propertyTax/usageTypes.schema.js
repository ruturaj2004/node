const mongoose = require("mongoose");

const UsageTypesSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            // unique: true
        },
        weightage: {
            type: Number,
            required: true,
        }
    },
    { timestamps: true }
);

const UsageTypesModel = mongoose.model("usageTypes", UsageTypesSchema);
module.exports = UsageTypesModel;
