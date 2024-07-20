const mongoose = require("mongoose");

const PropertyTaxPaymentSchema = new mongoose.Schema(
    {
       propertyId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"properties",
        autopopulate:true,
       },
       gpId: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "GramPanchayath",
         autopopulate: true,
     },
    //    mode:{
    //     type:String,
    //     enum:["online", "offline"],
    //     default:"offline",
    //    },
       status:{
        type:String,
        enum:["paid","unpaid"],
        default:"unpaid",
       },
    //    receiptNumber:{
    //     type:Number,
    //     required:false,
    //    },
       citizenId:{
        type:Number,
        required:false,
      
       }
    },
    {strict:false, timestamps: true }
);
PropertyTaxPaymentSchema.plugin(require("mongoose-autopopulate"))
const PropertyTaxPaymentModel = mongoose.model("propertytaxpayment", PropertyTaxPaymentSchema);
module.exports = PropertyTaxPaymentModel;
