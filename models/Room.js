const Schema = require('mongoose');

const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
    name: { type: String, required: true },
    number: { type: String, required: false },
    floor: { type: String, required: false },
    secondary: { type: String, required: false },
    primary: { type: String, required: false },
    backgroundColor: { type: String, required: false },
    other: { type: String, required: false },
    SINGLE_BAS_SAISON_PRICE: { type: Boolean, required: false, default: false },
    DOUBLE_BAS_SAISON_PRICE: { type: Boolean, required: false, default: false },
    SINGLE_HAUTE_SAISON_PRICE: { type: Boolean, required: false, default: false },
    DOUBLE_HAUTE_SAISON_PRICE: { type: Boolean, required: false, default: false },
    singleBprice: { type: Number, required: false },
    singleHprice: { type: Number, required: false },
    doubleBprice: { type: Number, required: false },
    doubleHprice: { type: Number, required: false },
    isNormal: { type: Boolean, required: false, default: false },
    number_places: { type: String, required: false },
    status: {
        type: String,
        enum: ['LIBRE', 'RESERVE', 'OCCUPE', 'FERMER'],
        default: 'LIBRE',
    },
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});

const Roomdb = mongoose.model('Room', RoomSchema);
module.exports = Roomdb;