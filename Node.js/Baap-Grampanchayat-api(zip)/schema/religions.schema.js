const mongoose = require("mongoose");

const ReligionsSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        groupId: {
            type: Number,
            required: true,
        },
    },
    {strict:false, timestamps: true }
);

const ReligionsModel = mongoose.model("religions", ReligionsSchema);
module.exports = ReligionsModel;
