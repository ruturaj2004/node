const mongoose = require("mongoose");

const ShopSchema = new mongoose.Schema(
    {
        groupId: {
            type: Number,
            required: true,
        },
        contactNo:{
            type: Number,
            required: true,
        },
        shopSize:{
            type:String,
            enum:["10*10","10*20","20*10"],
            default:"10*10",
        } 
    },
    { strict:false,timestamps: true }
);

const ShopModel = mongoose.model("shop", ShopSchema);
module.exports = ShopModel;
