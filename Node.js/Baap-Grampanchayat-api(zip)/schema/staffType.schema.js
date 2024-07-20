const mongoose = require("mongoose");

const StaffTypeSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        }
    },
    { timestamps: true }
);

const StaffTypeModel = mongoose.model("staffType", StaffTypeSchema);
module.exports = StaffTypeModel;
