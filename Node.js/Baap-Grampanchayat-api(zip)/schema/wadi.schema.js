const mongoose = require("mongoose");

const WadiSchema = new mongoose.Schema(
    {
        gpId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "GramPanchayath",
            autopopulate: true,
        },
        // villageName: {
        //     type: String,
        //     required: true,
        // },
        wadiName: {
            type: String,
            required: false,
            // unique: true,
        },
    },
    { strict:false,timestamps: true }
);
WadiSchema.plugin(require("mongoose-autopopulate"));
const WadiModel = mongoose.model("wadi", WadiSchema);
module.exports = WadiModel;
