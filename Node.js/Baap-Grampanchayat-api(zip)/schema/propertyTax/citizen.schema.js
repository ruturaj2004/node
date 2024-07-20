const mongoose = require("mongoose");

const CitizenSchema = new mongoose.Schema(
    {
        gpId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "GramPanchayath",
            autopopulate: true,
        },
        Religion: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "religions",
            autopopulate: true,
        },
        wardNumber: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ward",
            autopopulate: true,
            required: false,
        },
        street:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "street",
            autopopulate: true,
            required: false,
        },
        wadiName: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "wadi",
            autopopulate: true,
            required: false,
        },
        villageName: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "colony",
            autopopulate: true,
            required: false,
        },
        categories: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "category",
            autopopulate: true,
            required: false,
        },
        phoneNumber: {
            type: Number,
            required: false,
        },
        panNumber: {
            type: String,
            required: false,
        },
        aadharNumber: {
            type: Number,
            required: false,
        },
        citizenId:{
            type:Number,
            required:false
        }
    },
    { strict: false, timestamps: true }
);
CitizenSchema.plugin(require("mongoose-autopopulate"));
const CitizenModel = mongoose.model("citizen", CitizenSchema);
module.exports = CitizenModel;
