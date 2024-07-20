const mongoose = require("mongoose");

const CertificateDocumentsSchema = new mongoose.Schema(
    {
        gpId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "GramPanchayath",
            autopopulate: true,
        },
        applicationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "application",
            autopopulate: true,
        },
        citizenId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "citizen",
            autopopulate: true,
        },
        templateId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "certificatetypes",
            autopopulate: true,
        },
        // certificateId: {
        //     type: mongoose.Schema.Types.ObjectId,
        //     ref: "certificates",
        //     autopopulate: true,
        // },
        documents:{
            type:Array,
            required:false
        }
    },

    { strict: false, timestamps: true }
);
CertificateDocumentsSchema.plugin(require("mongoose-autopopulate"));
const CertificateDocumentsModel = mongoose.model(
    "certificatedocuments",
    CertificateDocumentsSchema
);
module.exports = CertificateDocumentsModel;
