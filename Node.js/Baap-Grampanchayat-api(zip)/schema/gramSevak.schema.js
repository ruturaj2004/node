const mongoose = require("mongoose");

const GramSevakSchema = new mongoose.Schema(
    {
        gpId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "GramPanchayath",
            autopopulate: true,
        },
        name: {
            type: String,
            required: true,
        },
        gender: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        appointmentDate: {
            type: Date,
            required: true,
        },
    },
    {strict:false, timestamps: true }
);
GramSevakSchema.plugin(require('mongoose-autopopulate'));
const GramSevakModel = mongoose.model("gramSevak", GramSevakSchema);
module.exports = GramSevakModel;
