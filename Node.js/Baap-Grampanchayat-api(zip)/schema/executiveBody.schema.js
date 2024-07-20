const mongoose = require("mongoose");

const ExecutiveBodySchema = new mongoose.Schema(
    {
        gpId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "GramPanchayath",
            autopopulate: true,
        },
        memberName: {
            type: String,
            required: true,
        },
        designation: {
            type: String,
            required: true,
        },
        gender: {
            type: String,
            enum: ["Male", "Female", "Others"],
            default: "Male",
        },
        wardNumber: {
            type: String,
            required: true,
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "category",
            autopopulate: true,
        },
        startDate: {
            type: String,
            required: true,
        },
        endDate: {
            type: String,
            required: true,
        },
    },
    { strict: false }
);

ExecutiveBodySchema.plugin(require("mongoose-autopopulate"));

const ExecutiveBodyModel = mongoose.model("executiveBody", ExecutiveBodySchema);
module.exports = ExecutiveBodyModel;
