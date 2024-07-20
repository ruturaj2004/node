const mongoose = require("mongoose");

const ColonySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            // unique: true,
        },
        // villageName: {
        //     type: String,
        //     required: false,
        // },
    },
    { timestamps: true }
);

const ColonyModel = mongoose.model("colony", ColonySchema);
module.exports = ColonyModel;
