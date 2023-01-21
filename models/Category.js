const mongoose = require('mongoose');
const Schema = require('mongoose');
const categorySchema = new mongoose.Schema({
    name: { type: String, required: false },
    img: { type: String, required: false },
    listFamily: [{ type: Schema.Types.ObjectId, ref: "Family" }],
    idDepot: { type: Schema.Types.ObjectId, ref: 'Depot', required: false },
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    },
});

const categoryDb = mongoose.model('Category', categorySchema);
module.exports = categoryDb;