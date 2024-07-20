const mongoose = require("mongoose");

const ApplicationCategorySchema = new mongoose.Schema(
    {

        groupId: {
            type: Number,
            required: true,
        },
    },
    { strict: false, timestamps: true }
);

const ApplicationCategoryModel = mongoose.model(
    "applicationcategory",
    ApplicationCategorySchema
);
module.exports = ApplicationCategoryModel;
