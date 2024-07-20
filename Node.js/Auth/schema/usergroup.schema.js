const mongoose = require("mongoose");

const UserGroupSchema = new mongoose.Schema(
    {
        groupId: {
            type: Number,
            ref: "group",
            // autopopulate: true,
            required: true,
        },
        status: {
            type: String,
            enum: ["Pending", "Active", "Rejected"],
            default: "Pending",
        },
        phoneNo: {
            type: Number,
        },
    },
    { strict: false, timestamps: true }
);
UserGroupSchema.plugin(require("mongoose-autopopulate"));
const UserGroupModel = mongoose.model("usergroup", UserGroupSchema);
module.exports = UserGroupModel;
