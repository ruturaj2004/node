const mongoose = require("mongoose");

const BankAccountSchema = new mongoose.Schema(
    {
        gpId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "GramPanchayath",
            autopopulate: true,
        },
        schemeName: {
            type: String,
            required: true,
        },
        bankAccountNumber: {
            type: String,
            required: true,
        },
        bankName: {
            type: String,
            required: true,
        },
        branch: {
            type: String,
            required: true,
        },
        ifscCode: {
            type: String,
            required: true,
        },
        totalPages: {
            type: Number,
            required: false,
        },
        chequeNumberFrom: {
            type: Number,
            required: false,
        },
        chequeNumberTo: {
            type: Number,
            required: false,
        },
        openingBalance: {
            type: Number,
            required: true,
        },
    },
    { timestamps: true }
);


BankAccountSchema.plugin(require('mongoose-autopopulate'));
const BankAccountModel = mongoose.model("bankAccount", BankAccountSchema);
module.exports = BankAccountModel;
