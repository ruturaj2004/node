const mongoose = require("mongoose");

const StaffSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        gpId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "GramPanchayath",
            autopopulate: true,
        },
        gender: {
            type: String,
            required: true,
        },
        dob: {
            type: String,
            required: true,
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "category",
            autopopulate: true,
        },
        caste: {
            type: String,
            required: true,
        },
        phoneNumber: {
                type: Number,
                required: true,
            },
        // type: {
        //     type: mongoose.Schema.Types.ObjectId,
        //     ref: "staffType",
        //     autopopulate: true,
        // },
        post: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "staffPost",
            autopopulate: true,
        },
        // employmentType: {
        //     type: String,
        //     required: true,
        // },
        // sanctionOrderNumber: {
        //     type: String,
        //     required: true,
        // },
        // sanctionOrderDate: {
        //     type: Date,
        //     required: true,
        // },
        // remarks: {
        //     type: String,
        //     required: true,
        // },
        selectionDate: {
            type: Date,
            required: true,
        },
        retirementDate: {
            type: Date,
            required: true,
        },
        payScale: {
            type: String,
            required: true,
        },
    },
    {strict:false, timestamps: true }
);
StaffSchema.plugin(require('mongoose-autopopulate'));

const StaffModel = mongoose.model("staff", StaffSchema);
module.exports = StaffModel;
