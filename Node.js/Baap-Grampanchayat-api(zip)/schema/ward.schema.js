const mongoose = require("mongoose");

const WardSchema = new mongoose.Schema(
    {
        wardNumber: {
            type: Number,
            required: true,
        },
        villageName: {
            type: String,
            required: true,
        },
        wardNumbers: {
            type: Array,
            required: false,
        },
        gpid: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "GramPanchayath",
            autopopulate: true,
        },
    },
    { strict: false, timestamps: true }
);
WardSchema.plugin(require("mongoose-autopopulate"));
const WardModel = mongoose.model("ward", WardSchema);
module.exports = WardModel;
