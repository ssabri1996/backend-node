const mongoose = require('mongoose');



const MenuSchema = new mongoose.Schema({
    dessert: { type: String, required: false },
    entree: { type: String, required: false },
    suite: { type: String, required: false },
    isPersonalize: { type: Boolean, required: false },
    name: { type: String, required: false },
    price: { type: Number, required: false },
    tarif: { type: String, required: false },
    description: { type: String, required: false },
    comment: { type: String, required: false },
    number_heure: { type: String, required: false },
    menuList: [{ type: Object }],
    typeRepas: { type: String, required: false },
    remise: { type: Number, required: false }
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
})

const menuDb = mongoose.model('Menu', MenuSchema)
module.exports = menuDb;