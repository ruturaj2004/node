const mongoose = require("mongoose");

const CertificateIssueSchema = new mongoose.Schema(
    {
        gpId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "GramPanchayath",
            autopopulate: true,
        },
        citizenId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "citizen",
            autopopulate: true,
        },
        certificateTypeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "certificatetypes",
            autopopulate: true,
        },
        applicationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "application",
            autopopulate: true,
        },
        // requiredDocument: [
        //     {
        //         registeredPurchaser: {
        //             type: Boolean,
        //             required: false,
        //         },
        //         registeredLetterOfConsent: {
        //             type: Boolean,
        //             required: false,
        //         },
        //         AwardLetter: {
        //             type: Boolean,
        //             required: false,
        //         },

        //         registeredDeedOfDonation: {
        //             type: Boolean,
        //             required: false,
        //         },
        //         InheritanceCertificate: {
        //             type: Boolean,
        //             required: false,
        //         },
        //         registeredWaiverLetter: {
        //             type: Boolean,
        //             required: false,
        //         },
        //         mortgageLetter: {
        //             type: Boolean,
        //             required: false,
        //         },
        //         registeredAgreement: {
        //             type: Boolean,
        //             required: false,
        //         },
        //         propertyCardExtractAndMap: {
        //             type: Boolean,
        //             required: false,
        //         },
        //         seatAllotmentOrderOfGovt: {
        //             type: Boolean,
        //             required: false,
        //         },

        //         orderOfPossession: {
        //             type: Boolean,
        //             required: false,
        //         },
        //         officialMapOfThePlace: {
        //             type: Boolean,
        //             required: false,
        //         },

        //         otherLegalDocuments: {
        //             type: Boolean,
        //             required: false,
        //         },
        //     },
        // ],
    },
    { strict: false, timestamps: true }
);
CertificateIssueSchema.plugin(require("mongoose-autopopulate"));
const CertificateIssueModel = mongoose.model(
    "certificateissue",
    CertificateIssueSchema
);
module.exports = CertificateIssueModel;
