const mongoose = require("mongoose");

const ModificationSchema = new mongoose.Schema(
    {
        gpId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "GramPanchayath",
            autopopulate: true,
        },
        modificationNumber:{
            type:Number,
            required:false,
        },
       
        propertyId:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"properties",
            autopopulate: true,
            required:true
        },
        
    },
    { strict: false, timestamps: true }
);
ModificationSchema.plugin(require("mongoose-autopopulate"))
const ModificationModel = mongoose.model("modification", ModificationSchema);
module.exports = ModificationModel;
