const mongoose = require("mongoose");

const CompetitionSchema = new mongoose.Schema(
    {
        groupId: {
            type: Number,
            required: true,
        },
    },
    { strict: false, timestamps: true }
);

const CompetitionModel = mongoose.model("competition", CompetitionSchema);
module.exports = CompetitionModel;
