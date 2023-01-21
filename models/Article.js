const mongoose = require('mongoose');
const Schema = require('mongoose');

const articleSchema = new mongoose.Schema({
    name: { type: String, required: false },
    img: { type: String, required: false },
    marque: { type: String, required: false },
    unity: { type: String, required: false },
    quantity: { type: Number, required: false },
    idType: { type: Schema.Types.ObjectId, ref: 'Type', required: false },
    isHide: { type: Boolean, required: false, default: false },
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    },
});

const articleDb = mongoose.model('Article', articleSchema);
module.exports = articleDb;