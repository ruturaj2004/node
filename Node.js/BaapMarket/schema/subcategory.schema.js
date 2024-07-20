const mongoose = require("mongoose");

const SubcategorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        groupId: {
            type: Number,
            required: true,
        },
        categoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "category",
            autopopulate: true,
        },
    },
    { strict: false, timestamps: true }
);
SubcategorySchema.plugin(require("mongoose-autopopulate"));
const SubcategoryModel = mongoose.model("subcategory", SubcategorySchema);
module.exports = SubcategoryModel;
