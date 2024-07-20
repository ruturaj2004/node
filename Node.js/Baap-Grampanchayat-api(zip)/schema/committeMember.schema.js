const mongoose = require("mongoose");

const CommitteMemberSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
        gender: {
            type: String,
            required: true,
        },
        post: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "staffPost",
            // autopopulate: true,
        },
        remarks: {
            type: String,
            required: true,
        },
    },
    {strict:false, timestamps: true }
);
CommitteMemberSchema.plugin(require('mongoose-autopopulate'));

const CommitteMemberModel = mongoose.model("committeMember", CommitteMemberSchema);
module.exports = CommitteMemberModel;
