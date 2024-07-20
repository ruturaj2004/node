const mongoose = require("mongoose");

const ApplicationSchema = new mongoose.Schema(
    {
        gpId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "GramPanchayath",
            autopopulate: true,
        },
        citizenId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "citizen",
            autopopulate: true,
        },
        templateId:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"certificatetypes",
            autopopulate: true,
        },
        paymentReceiptNo:{
            type:String,
            required:false
        },
        status: {
            type: String,
            enum: ["Pending", "Issued", "Rejected"],
            default: "Pending",  
        },
    },
    { strict: false, timestamps: true }
);
ApplicationSchema.plugin(require("mongoose-autopopulate"))
const ApplicationModel = mongoose.model("application", ApplicationSchema);
module.exports = ApplicationModel;
