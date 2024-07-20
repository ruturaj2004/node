const mongoose = require("mongoose");

const PropertiesSchema = new mongoose.Schema(
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
        propertyDetails: {
            propertyId: {
                type: Number,
                required: true,
            },
            village: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "colony",
                autopopulate: true,
            },
            ward: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "ward",
                autopopulate: true,
            },
            wadi: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "wadi",
                autopopulate: true,
            },
            street: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "street",
                autopopulate: true,
            },
            villageName: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "colony",
                autopopulate: true,
            },
            hasToilet: {
                type: String,
                required: false,
            },
            waterConnection: {
                type: Boolean,
                required: false,
            },
            waterConnectionType: {
                type: String,
                enum: ["General", "Private", "Meter", "None"],
                default: "None",
            },
        },
        owner: [
            {
                firstName: {
                    type: String,
                    required: true,
                },
                lastName: {
                    type: String,
                    required: true,
                },
                middleName: {
                    type: String,
                    required: false,
                },
                spouseName: {
                    type: String,
                    required: false,
                },
                primaryUser: {
                    type: Boolean,
                    required: false,
                },
                isActive: {
                    type: Boolean,
                    default: true,
                    required: false,
                },
                tenant: {
                    type: Boolean,
                    default: false,
                    required: false,
                },
                status: {
                    type: String,
                    required: false,
                },
            },
        ],
        occupant: [
            {
                occupantfname: {
                    type: String,
                    required: false,
                },
                occupantlname: {
                    type: String,
                    required: false,
                },
                occupantmname: {
                    type: String,
                    required: false,
                },
                toilet: {
                    type: Boolean,
                    required: false,
                },
                hasFaucetConnection: {
                    type: String,
                    required: false,
                },
                waterConnection: {
                    type: Boolean,
                    required: false,
                },
                waterConnectionType: {
                    type: String,
                    required: false,
                },
                primaryUser: {
                    type: Boolean,
                    required: false,
                },
                isActive: {
                    type: Boolean,
                    default: true,
                    required: false,
                },
                tenant: {
                    type: Boolean,
                    default: false,
                    required: false,
                },
                status: {
                    type: String,
                    required: false,
                },
            },
        ],
        floors: [
            {
                floorNo: {
                    type: Number,
                    required: false,
                },
                constructionType:{
                    type: mongoose.Schema.Types.ObjectId,
                    ref:"constructionType",
                    autopopulate: true
                },
                length:{
                    type: Number,
                    required:false,
                },
                width:{
                    type: Number,
                    required:false,
                },
                areapersqrt:{
                    type: Number,
                    required:false,
                },
                waterRegistrationId:{
                    type:mongoose.Schema.Types.ObjectId,
                    ref:"watertaxregistration",
                    autopopulate:true
                }
                
            
            },
        ],
    },
    { strict: false, timestamps: true }
);
PropertiesSchema.plugin(require("mongoose-autopopulate"));
const PropertiesModel = mongoose.model("properties", PropertiesSchema);
module.exports = PropertiesModel;
