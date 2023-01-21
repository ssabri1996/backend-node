const mongoose = require('mongoose');
const Schema = require('mongoose');
const familySchema = new mongoose.Schema({
    name: { type: String, required: false },
    img: { type: String, required: false },
    listType: [{ type: Schema.Types.ObjectId, ref: "Type" }],
    idCategory: { type: Schema.Types.ObjectId, ref: 'Category', required: false },
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    },
});

const familyDb = mongoose.model('Family', familySchema);
module.exports = familyDb;