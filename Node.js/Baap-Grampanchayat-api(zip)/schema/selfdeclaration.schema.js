const mongoose = require("mongoose");

const SelfDeclarationSchema = new mongoose.Schema(
    {
        gpId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "GramPanchayath",
            autopopulate: true,
        },

    },
    {strict:false, timestamps: true }
);

const SelfDeclarationModel = mongoose.model("selfdeclaration", SelfDeclarationSchema);
module.exports = SelfDeclarationModel;
