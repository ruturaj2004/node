const mongoose = require("mongoose");

const ShiftSchema = new mongoose.Schema(
    {
        groupId: {
            type: Number,
            required: true,
        },

    },
    {strict:false, timestamps: true }
);

const ShiftModel = mongoose.model("shift", ShiftSchema);
module.exports = ShiftModel;
