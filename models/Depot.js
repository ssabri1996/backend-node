const mongoose = require('mongoose');
const Schema = require('mongoose');

const depotSchema = new mongoose.Schema({
    name: { type: String, required: false },
    img: { type: String, required: false },
    listCategorys: [{ type: Schema.Types.ObjectId, ref: "Category" }],
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    },
});

const depotDb = mongoose.model('Depot', depotSchema);
module.exports = depotDb;