const mongoose = require('mongoose');

const platSchema = new mongoose.Schema({
    name: { type: String, required: false },
    price: { type: Number, required: false },
    tarif: { type: String, required: false },
    description: { type: String, required: false },
    category: { type: String, required: false },
    isActive: { type: String, default: true }
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    },
});

const platDb = mongoose.model('Plat', platSchema);
module.exports = platDb;