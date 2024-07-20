const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    groupId: {
        type: Number,
        required: true,
    },
});

const CategoryModel = mongoose.model("category", CategorySchema);
module.exports = CategoryModel;
