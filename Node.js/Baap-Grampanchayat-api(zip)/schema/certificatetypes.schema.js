const mongoose = require("mongoose");

const CertificateTypesSchema = new mongoose.Schema(
    {
        gpId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "GramPanchayath",
            autopopulate: true,
        },
        citizenId: {
            type: Number,
            required: false,
        },
        requiredDocument: {
            type: Array,
            required: true,
        },
        rules: {
            type: Array,
            required: false,
        },
        isPaidDocument: {
            type: Boolean,
            required: false,
        },
    },
    { strict: false, timestamps: true }
);
CertificateTypesSchema.plugin(require("mongoose-autopopulate"));
const CertificateTypesModel = mongoose.model(
    "certificatetypes",
    CertificateTypesSchema
);
module.exports = CertificateTypesModel;
