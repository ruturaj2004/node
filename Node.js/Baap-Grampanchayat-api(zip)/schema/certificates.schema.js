const mongoose = require("mongoose");

const CertificatesSchema = new mongoose.Schema(
    {
        applicationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "application",
            autopopulate: true,
        },
        gpId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "GramPanchayath",
            autopopulate: true,
        },
        // receiptNo:{
        //     type:Number,
        //     required:false
        // },
        citizenId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "citizen",
            autopopulate: true,
        },
        templateId:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"certificatetypes",
            autopopulate: true,
        },
      
    },
    { strict: false, timestamps: true }
);
CertificatesSchema.plugin(require("mongoose-autopopulate"));
const CertificatesModel = mongoose.model("certificates", CertificatesSchema);
module.exports = CertificatesModel;
0;
