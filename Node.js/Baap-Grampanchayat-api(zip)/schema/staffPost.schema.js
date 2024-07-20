const mongoose = require("mongoose");

const StaffPostSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        }
    },
    { timestamps: true }
);

const StaffPostModel = mongoose.model("staffPost", StaffPostSchema);
module.exports = StaffPostModel;
