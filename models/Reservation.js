const Schema = require('mongoose');

const mongoose = require('mongoose');

const ReservationSchema = new mongoose.Schema({
    type: { type: String, required: false, enum: ['room', 'menu', 'plat'] },
    status_reservation: {
        type: String,
        enum: ['INITIALISER',
            'ANNULER', 'PAYE', 'REMBOURSSE',
            'LIVRE', 'COMMANDE', 'PERDU'
        ],
        default: 'INITIALISER',
    },
    tarif: {
        type: String,
        enum: ['SINGLE_BAS_SAISON_PRICE',
            'DOUBLE_BAS_SAISON_PRICE',
            'SINGLE_HAUTE_SAISON_PRICE',
            'DOUBLE_HAUTE_SAISON_PRICE'
        ],
        default: 'SINGLE_BAS_SAISON_PRICE'
    },
    roomID: { type: Schema.Types.ObjectId, ref: 'Room', required: false },
    menuID: { type: Schema.Types.ObjectId, ref: 'Menu', required: false },
    platID: { type: Schema.Types.ObjectId, ref: 'Plat', required: false },
    listmenuID: [{ type: Schema.Types.ObjectId, ref: "Menu" }],
    start: { type: String, required: false },
    end: { type: String, required: false },
    number_guests: { type: Number, required: false },
    number_children: { type: Number, required: false },
    number_adulte: { type: Number, required: false },
    number_persons: { type: Number, required: false },
    number_days: { type: Number, required: false },
    last: { type: String, required: false },
    clientID: { type: Schema.Types.ObjectId, ref: 'User' },
    roomName: { type: String, required: false },
    comment: { type: String, required: false },
    remark: { type: String, required: false },
    extra: { type: String, required: false },
    price: { type: String, required: false },
    tarifType: { type: String, required: false },
    startFiltre: { type: String, required: false },
    endFiltre: { type: String, required: false },
    filtercolor: { type: String, required: false },
    isActive: { type: String, required: false, default: true },
    number_heure: { type: String, required: false },
    typeRepas: { type: String, required: false },
    nb_eau: { type: Number, required: false },
    nb_soda: { type: Number, required: false },
    remise: { type: Number, required: false },
    priceTotal: { type: Number, required: false, default: 0 },
    remiseTotal: { type: Number, required: false, default: 0 }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});



const Reservationdb = mongoose.model('Reservation', ReservationSchema);
module.exports = Reservationdb;