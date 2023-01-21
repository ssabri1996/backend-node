/**
 * The User model describes admins in our case
 */
const Schema = require('mongoose');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    phone_number: { type: String, required: false },
    address: { type: String, required: false },
    number_phone: { type: String, required: false },
    identity_document: {
        type: String,
        enum: ['CIN', 'PASSPORT', 'PERMI DE CONDUIRE'],
        default: 'CIN',
    },
    number_identity_document: { type: String, required: false },
    email: { type: String, required: false },
    password: { type: String, required: false },
    isActive: { type: String, required: false, default: true },
    isAdmin: { type: String, required: false, default: false },
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    },
});

const userModel = mongoose.model('User', userSchema);
module.exports = userModel;