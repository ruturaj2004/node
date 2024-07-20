const mongoose = require("mongoose");

const StreetSchema = new mongoose.Schema(
    {
        description: {
            type: String,
            required: false,
        },
        villageName: {
            type: String,
            required: true,
        },
        gpId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "GramPanchayath",
            autopopulate: true,
        },
    },
    { timestamps: true }
);
StreetSchema.plugin(require("mongoose-autopopulate"));
const StreetModel = mongoose.model("street", StreetSchema);
module.exports = StreetModel;
