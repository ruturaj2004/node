const mongoose = require("mongoose");
const PropertyDetailsSchema = require("./propertyDetails.schema");
const PropertyOwnerDetailsSchema = require("./proeprtyOwnerDetails.schema");
const PropertyTaxExemptionSchema = require("./propertyTaxExemptions.schema");

const PropertyTaxEntrySchema = new mongoose.Schema(
    {
        ownerDetails: {
            type: PropertyOwnerDetailsSchema,
        },
        propertyDetails: {
            type: [PropertyDetailsSchema]
        },
        exemptions: {
            type: [PropertyTaxExemptionSchema]
        }
    },
    {strict:false, timestamps: true }
);

PropertyTaxEntrySchema.plugin(require("mongoose-autopopulate"));

const PropertyTaxEntryModel = mongoose.model("propertyTaxEntry", PropertyTaxEntrySchema);
module.exports = PropertyTaxEntryModel;
