const mongoose = require('mongoose');
const Schema = require('mongoose');

const typeSchema = new mongoose.Schema({
    name: { type: String, required: false },
    img: { type: String, required: false },
    listArticle: [{ type: Schema.Types.ObjectId, ref: "Article" }],
    idFamily: { type: Schema.Types.ObjectId, ref: 'Family', required: false },
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    },
});

const typeDb = mongoose.model('Type', typeSchema);
module.exports = typeDb;