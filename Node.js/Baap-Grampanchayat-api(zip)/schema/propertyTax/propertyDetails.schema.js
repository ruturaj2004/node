const mongoose = require("mongoose");

const PropertyDetailsSchema = new mongoose.Schema(
    {
        constructionType: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "constructionType",
            autopopulate: true,
        },
        floor: {
            type: String,
            required: true,
        },
        length: {
            type: Number,
            required: true,
        },
        width: {
            type: Number,
            required: true,
        },
        areaInSqMeter: {
            type: Number,
            required: true,
        },
        areaInSqft: {
            type: Number,
            required: true,
        },
        usageType: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "usageTypes",
            autopopulate: true,
        },
        constructionYear: {
            type: Number,
            required: true,
        },
        age: {
            type: Number,
            required: true,
        },
    },
    {strict:false, timestamps: true }
);
PropertyDetailsSchema.plugin(require("mongoose-autopopulate"))
// const PropertyDetailsModel = mongoose.model("propertyDetails", PropertyDetailsSchema);
// module.exports = PropertyDetailsModel;

module.exports = PropertyDetailsSchema;
