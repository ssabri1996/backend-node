const mongoose = require('mongoose');
const Schema = require('mongoose');

const sectionSchema = new mongoose.Schema({
    name: { type: String, required: false },
    index: { type: String, required: true, unique: true },
    specsArray: { type: Array, required: false },
    specsObj: { type: Array, required: false },
    isHide: { type: Boolean, required: false, default: false },
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    },
});

const sectionDb = mongoose.model('Section', sectionSchema);
module.exports = sectionDb;
