const mongoose = require("mongoose");

const FinancialYearSchema = new mongoose.Schema(
    {

        gpId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "GramPanchayath",
            autopopulate: true,
        },
        from: {
            type: String,
            required: true,
        },
        to: {
            type: String,
            required: true,
        },
        displayName: {
            type: String,
            required: false,
        },
        isfinancial:{
            type: Boolean,
            required: false,
        }
    },
    { strict: false, timestamps: true }
);

const FinancialYearModel = mongoose.model("financialyear", FinancialYearSchema);
module.exports = FinancialYearModel;
