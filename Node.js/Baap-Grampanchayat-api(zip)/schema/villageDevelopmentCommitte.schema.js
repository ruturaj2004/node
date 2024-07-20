const mongoose = require("mongoose");

const VillageDevelopmentCommitteeSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            // unique: true
        },
        gpId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "GramPanchayath",
            autopopulate: true,
        },
        gramSabhaDate: {
            type: Date,
            required: true,
        },
        resolutionNumber: {
            type: Number,
            required: true,
        },
        noOfOfficers: {
            type: Number,
            required: true,
            
        },
        committeeMembers: { type: [mongoose.Schema.ObjectId], ref: 'committeMember', defaultValue: [] },
    },
    { timestamps: true, strictPopulate: false }
);

VillageDevelopmentCommitteeSchema.plugin(require('mongoose-autopopulate'));
const VillageDevelopmentCommitteeModel = mongoose.model(
    "villageDevelopmentCommittee",
    VillageDevelopmentCommitteeSchema
);
module.exports = VillageDevelopmentCommitteeModel;
