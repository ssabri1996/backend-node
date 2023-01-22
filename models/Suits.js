const mongoose = require('mongoose');
const Schema = require('mongoose');

const suitsSchema = new mongoose.Schema({
    title: { type: String, required: false },
    price: { type: Number, required: true, validate : {
        validator : Number.isInteger,
        message   : '{VALUE} is not an integer value'
      } },
    category: { type: Array, required: true },
    period: { type: String, required: false, default: false },
    gridimage: { type: String, required: false, default: false },
    listimage: { type: String, required: false, default: false },
    sliderimage: { type: String, required: false, default: false },
    text: { type: String, required: false, default: false },
    longdesc: { type: String, required: false, default: false },
    authors: { type: Array, required: false, default: false },
    amenities: { type: Array, required: false, default: {title: "Wi-Fi haut débit", icon: "fal fa-wifi" } },
    rules: { type: Array, required: false, default: false },
    cancellation: { type: String, required: false, default: false },
    location: { type: Array, required: false, default: false },
    offer: { type: Boolean, required: false, default: true },
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    },
});

const suitsDb = mongoose.model('suits', suitsSchema);
module.exports = suitsDb;
