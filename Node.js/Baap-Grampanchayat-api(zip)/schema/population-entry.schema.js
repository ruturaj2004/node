const mongoose = require("mongoose");

const PopulationEntrySchema = new mongoose.Schema(
    {
        gpid: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "GramPanchayath",
            autopopulate: true,
        },
        year: {
            type: Number,
            required: false,
            // unique: true,
        },
        maleCount: {
            type: Number,
            required: true,
        },
        femaleCount: {
            type: Number,
            required: true,
        },
        totalCount: {
            type: Number,
            required: true,
        },
        backwardCasteCount: {
            type: Number,
            // required: false,
        },
        SceduleTribeCount: {
            type: Number,
            // required: false,
        },
        OtherCount: {
            type: Number,
            // required: false,
        },
    },
    { timestamps: true }
);

PopulationEntrySchema.index({'gpid': 1, 'year': 1}, {unique: true});
PopulationEntrySchema.plugin(require('mongoose-autopopulate'));
const PopulationEntryModel = mongoose.model(
    "PopulationEntry",
    PopulationEntrySchema
);

module.exports = PopulationEntryModel;
