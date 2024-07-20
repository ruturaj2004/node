const mongoose = require("mongoose");

const PropertyOwnerDetailsSchema = new mongoose.Schema(
    {
        wadi: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "wadi",
            autopopulate: true,
        },
        street: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "street",
            autopopulate: true,
        },
        ward: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ward",
            autopopulate: true,
        },
        surveyNumber: {
            type: String,
            required: false,
        },
        srNo: {
            type: String,
            required: false,
        },
        incomeNumber: {
            type: String,
            required: false,
        },
        owner: {
            firstName: {
                type: String,
                required: true,
            },
            lastName: {
                type: String,
                required: true,
            },
            middleName: {
                type: String,
                required: false,
            },
        },
        spouse: [
            {
                firstName: {
                    type: String,
                    required: true,
                },
                lastName: {
                    type: String,
                    required: true,
                },
                middleName: {
                    type: String,
                    required: false,
                },
            },
        ],
        coOwners: [
            {
                firstName: {
                    type: String,
                    required: true,
                },
                lastName: {
                    type: String,
                    required: true,
                },
                middleName: {
                    type: String,
                    required: false,
                },
            },
        ],
        occupant: {
            firstName: {
                type: String,
                required: true,
            },
            lastName: {
                type: String,
                required: true,
            },
            middleName: {
                type: String,
                required: false,
            },
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "category",
            autopopulate: true,
        },
        mobileNumber: {
            type: String,
            required: false,
        },
        adhar: {
            type: String,
            required: false,
        },
        hasToilet: {
            type: String,
            required: false,
        },
        hasFaucetConnection: {
            type: Boolean,
            required: false,
        },
        waterConnectionType: {
            type: String,
            enum: ["General", "Private", "Meter", "None"],
            default: "None",
        },
    },
    {strict:false, timestamps: true }
);

PropertyOwnerDetailsSchema.plugin(require("mongoose-autopopulate"));

// const PropertyOwnerDetailsModel = mongoose.model("propertyOwnerDetails", PropertyOwnerDetailsSchema);
// module.exports = PropertyOwnerDetailsModel;
module.exports = PropertyOwnerDetailsSchema;
