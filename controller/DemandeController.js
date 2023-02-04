
const nodemailer = require("nodemailer");
const reservationModel = require('../models/Reservation');
const userModel = require('../models/User');
const roomModel = require('../models/Room');
const DemandeModel = require('../models/Demande')
const { ObjectID } = require("mongodb");

exports.createDemande = async(req, res) => {
    const { startDate, endDate } = req.body;
    if (!req.body) {
        res.status(400).json({ message: 'content can not be empty' });
    }
    const villa = await reservationModel.find({
        "roomName": "Toute la villa",
        "isActive": true,
        $and: [{
            $or: [{
                    "start": startDate,
                    "end": endDate,
                },
                {
                    "start": {
                        $lt: startDate
                    },
                    "end": {
                        $gte: endDate
                    }
                },
                {
                    "start": startDate,
                    "end": {
                        $gte: endDate
                    }
                },
                {
                    "start": startDate,
                    "end": {
                        $lt: endDate
                    }
                },
                {
                    "start": {
                        $lt: endDate
                    },
                    "end": {
                        $gte: endDate
                    }
                },


            ]
        }]

    })
    // if suit array not empty ==> then suit is booked
    if (villa.length != 0) {
        return res.status(400).json({ message: 'la date de reservation est deja existe !' })
    }
    await reservationModel.find({
            "roomName": req.body.name,
            "isActive": true,
            $and: [{
                $or: [{
                        "start": startDate,
                        "end": endDate,
                    },
                    {
                        "start": {
                            $lt: startDate
                        },
                        "end": {
                            $gte: endDate
                        }
                    },
                    {
                        "start": startDate,
                        "end": {
                            $gte: endDate
                        }
                    },
                    {
                        "start": startDate,
                        "end": {
                            $lt: endDate
                        }
                    },
                    {
                        "start": {
                            $lt: endDate
                        },
                        "end": {
                            $gte: endDate
                        }
                    },



                ]
            }]
        }).then(async resp => {
            // if exist one reservation in this date intervale ===> suit is booked
                if (resp.length != 0) {
                    return res.status(400).json({ message: 'la date de reservation est deja existe !' })
                }
                const user = new userModel({
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    number_phone: req.body.number_phone,
                    email: req.body.email
                })

                await user.save().then(async user => {
                    const room = new roomModel({
                        name: req.body.name,
                        number: 0,
                        floor: '',
                        secondary: '',
                        primary: '',
                        backgroundColor: req.body.backgroundColor,
                        other: req.body.other,
                        number_places: 0,
                        status: req.body.status_room,
                        SINGLE_BAS_SAISON_PRICE: req.body.SINGLE_BAS_SAISON,
                        DOUBLE_BAS_SAISON_PRICE: req.body.DOUBLE_BAS_SAISON,
                        SINGLE_HAUTE_SAISON_PRICE: req.body.SINGLE_HAUTE_SAISON,
                        DOUBLE_HAUTE_SAISON_PRICE: req.body.DOUBLE_HAUTE_SAISON
                    })
                    await room.save().then(async room => {

                        const newRes = new DemandeModel({
                            type: req.body.roomType,
                            status_reservation: req.body.status_reservation,
                            roomID: room._id,
                            number_guests: 0,
                            number_children: req.body.number_children,
                            last: req.body.last,
                            clientID: user._id,
                            comment: req.body.comment,
                            extra: req.body.extra,
                            price: req.body.price,
                            start: req.body.startDate,
                            end: req.body.endDate,
                            startFiltre: req.body.startFiltre,
                            endFiltre: req.body.endFiltre,
                            number_adulte: req.body.number_adulte,
                            number_persons: req.body.number_persons,
                            number_days: req.body.number_days,
                            roomName: req.body.name,
                            tarifType: req.body.tarifType,
                            remark: req.body.remark,
                            filtercolor: req.body.backgroundColor
                        })
                        newRes.save().then(data => {
                            //reservationEnligneAndSendEmail(req,res)
                            res.status(201).json({
                                message: "chambre reserver avec success",
                                data: data
                            })

                        }).catch(err => {
                            res.status(500).send(err)
                        })
                    })

                }).catch(err => {
                    res.status(500).send(err)
                })

            }

        )
        .catch(err => res.status(500).send(err))
}

exports.getAllDemandes = async (req,  res) =>{
    const demandes = await DemandeModel.find()
    return res.status(200).json(demandes)
}

exports.approveDemande = async (req,res) =>{
    const id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(404).send("Id not valid");
    }
    const demande = await DemandeModel.findById({_id: id})
    if (demande) {
        const newRes = new reservationModel({
            type: demande.type,
            status_reservation: demande.status_reservation,
            roomID: demande.roomID,
            number_guests: 0,
            number_children: demande.number_children,
            last: demande.last,
            clientID: demande.clientID,
            comment: demande.comment,
            extra: demande.extra,
            price: demande.price,
            start: demande.start,
            end: demande.end,
            startFiltre: demande.startFiltre,
            endFiltre: demande.endFiltre,
            number_adulte: demande.number_adulte,
            number_persons: demande.number_persons,
            number_days: demande.number_days,
            roomName: demande.roomName,
            tarifType: demande.tarifType,
            remark: demande.remark,
            filtercolor: demande.backgroundColor
        })
        newRes.save().then(data => {
            res.status(201).json({
                message: "demande approuver avec success",
                data: data
            })
            DemandeModel.deleteOne({_id: id})
        }).catch(err => {
            res.status(500).send(err)
        })
    }
}