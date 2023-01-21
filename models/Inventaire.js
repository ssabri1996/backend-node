const mongoose = require("mongoose");
const Schema = require("mongoose");

const inventaireSchema = new mongoose.Schema({
    date: { type: String, required: false },
    name: { type: String, required: true },
    articleList: [{ type: Object }],
    clientID: { type: Schema.Types.ObjectId, ref: "User" },
    depot: { type: String, required: false },
    category: { type: String, required: false },
    isDraft: { type: Boolean, required: false },
}, {
    timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at",
    },
});

const inventaireDb = mongoose.model("Inventaire", inventaireSchema);
module.exports = inventaireDb;