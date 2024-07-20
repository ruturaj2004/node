const mongoose = require("mongoose");
const GramPanchayathSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            // unique: true,
        },
        displayName: {
            type: String,
        },
        taluka: {
            type: String,
            required: true,
        },
        district: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ["Pending", "Approved", "Rejected"],
            default: "Pending",
        },

        // pinCode: {
        //     type: Number,
        //     required: true,
        // },
        phoneNumber: {
            type: Number,
            required: true,
        },
        email: {
            type: String,
            required: false,
        },
        lgdCode: {
            type: String,
            required: true,
            unique: true,
        },
        primaryUserId: {
            type: String,

            // required: true,
        },
    },
    {
        strict: false,
        timestamps: true,
    }
);

const GramPanchayathModel = mongoose.model(
    "GramPanchayath",
    GramPanchayathSchema
);

module.exports = GramPanchayathModel;
