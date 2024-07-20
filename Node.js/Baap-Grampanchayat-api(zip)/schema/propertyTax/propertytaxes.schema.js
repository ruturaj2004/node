const mongoose = require("mongoose");

const PropertyTaxesSchema = new mongoose.Schema(
    {
        gpId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "GramPanchayath",
            autopopulate: true,
        },
        areaOfFeet:{
            type:Number,
            required: false,
        },
        areaOfMeter:{
            type:Number,
            required: false,
        }
        
        // constructionType: {
        //     type: mongoose.Schema.Types.ObjectId,
        //     ref: "constructionType",
        //     autopopulate: true,
        // },
        // // floor: {
        // //     type: String,
        // //     required: true,
        // // },
        // length: {
        //     type: Number,
        //     required: true,
        // },
        // width: {
        //     type: Number,
        //     required: true,
        // },
        // areaInSqMeter: {
        //     type: Number,
        //     required: true,
        // },
        // areaInSqft: {
        //     type: Number,
        //     required: true,
        // },
        // usageType: {
        //     type: mongoose.Schema.Types.ObjectId,
        //     ref: "usageTypes",
        //     autopopulate: true,
        // },
        // constructionYear: {
        //     type: Number,
        //     required: true,
        // },
        // age: {
        //     type: Number,
        //     required: true,
        // },
    },
    { strict: false, timestamps: true }
);
PropertyTaxesSchema.plugin(require("mongoose-autopopulate"));

const PropertyTaxesModel = mongoose.model("propertytaxes", PropertyTaxesSchema);
module.exports = PropertyTaxesModel;
