const mongoose = require('mongoose');
const Schema = require('mongoose');

const courseSchema = new mongoose.Schema({
    code: { type: Number, required: false },
    date: { type: String, required: false },
    articleList: [{ type: Object }],
    oldList: [{ type: Object }],
    types: [String],
    price: { type: Number, required: false },
    person: { type: String, required: false },
    clientID: { type: Schema.Types.ObjectId, ref: 'User' },
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    },
});

const courseDb = mongoose.model('Course', courseSchema);
module.exports = courseDb;