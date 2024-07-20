const mongoose = require("mongoose");

const GramPanchayathLGDCodeSchema = new mongoose.Schema({
    gpName : {
        type: String,
        required: true
    },
    taluka : {
        type: String,
        required: true
    },
    district : {
        type: String,
        required: true
    },
    pinCode : {
        type: Number,
        required: true
    },
    
    code : {
        type: String,
        required: true
    },
});

const GramPanchayathLGDCodeModel = mongoose.model("GramPanchayathLGDCode", GramPanchayathLGDCodeSchema);

module.exports = GramPanchayathLGDCodeModel;

