const nodemailer = require("nodemailer");
const reservationModel = require('../models/Reservation');
const suitsModel = require('../models/Suits');
const userModel = require('../models/User');
const roomModel = require('../models/Room');
const menuModel = require('../models/Menu');
const platModel = require('../models/Plat');
const { ObjectID } = require("mongodb");
const { now } = require("mongoose");



// list
exports.list = async(req, res) => {
    try {
        var reservation = await reservationModel.find({...req.query });
        res.status(200).json(reservation);
    } catch (error) {

        res.status(200).json({ error });
    }
};

// create
exports.create = async(req, res) => {
    if (!req.body) {
        res.status(400).json({ message: 'content can not be empty' });
    }
    var reservation = new reservationModel(req.body);
    try {
        if (req.body.first_name && req.body.last_name && req.body.number_identity_document) {
            var user = new userModel(req.body);
            user = await user.save();
            reservation.clientID = user._id;
        }
        if (req.body.client_id) {
            reservation.clientID = req.body.client_id;
        }
        reservation = await reservation.save();
        reservation.price = 0;
        // calculate price
        if (reservation.roomID != '')
            room = await roomModel.findById(reservation.roomID);

        if (room) {
            var number_of_days = 1;
            if (req.body.startDate && req.body.endDate) {
                var startDate = Date.parse(req.body.startDate);
                var endDate = Date.parse(req.body.endDate);
                number_of_days = endDate - startDate;
                number_of_days = Math.floor(number_of_days / (1000 * 60 * 60 * 24));
            }
            reservation.price =
                (parseFloat(reservation.price) + parseFloat(room[reservation.tarif])) * number_of_days;
            room.status = 'RESERVE';
            await room.save();
        }
        plat = await platModel.findById(reservation.platID);
        if (plat) {
            reservation.price =
                parseFloat(reservation.price) + parseFloat(plat.price);
        }
        menu = await menuModel.findById(reservation.menuID);
        if (menu) {
            reservation.price =
                parseFloat(reservation.price) + parseFloat(menu.price);
        }

        reservation = await reservation.save();

        res.status(200).json({
            message: 'reservation was created successfully',
            reservation: reservation,
        });
    } catch (error) {
        res.status(500).json({ error });
    }
};


// new api to create reservation
exports.createReservation = async(req, res) => {
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

                        const newRes = new reservationModel({
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
                            reservationEnligneAndSendEmail(req,res)
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

// update reservation 
exports.updateReservation = async(req, res) => {
    const id = req.params.id;
    const { startDate, endDate } = req.body;


    if (!ObjectID.isValid(id)) {
        return res.status(404).send("Id not valid");
    }

    if (!req.body) {
        res.status(400).json({ message: 'content can not be empty' });
    }


    await reservationModel.findOne({ _id: id }).then(async data => {

        if (!data) return res.status(400).json({ message: 'cannot find reservation !' })
            // test pour connaitre si la date modifier ou nn 
        if (data.start == startDate && data.end == endDate) {



            const userID = data.clientID;
            const roomID = data.roomID;
            const User = await userModel.findByIdAndUpdate({ _id: userID }, {
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                number_phone: req.body.number_phone,
                email: req.body.email
            }, {
                new: true
            });

            await User.save().then(async user => {

                const Room = await roomModel.findByIdAndUpdate({ _id: roomID }, {
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
                    DOUBLE_HAUTE_SAISON_PRICE: req.body.DOUBLE_HAUTE_SAISON,
                }, { new: true });
                await Room.save().then(async result => {

                    const reservation = await reservationModel.findByIdAndUpdate({ _id: id }, {
                        type: req.body.roomType,
                        status_reservation: req.body.status_reservation,
                        roomID: result._id,
                        number_guests: 0,
                        number_children: req.body.number_children,
                        last: req.body.last,
                        clientID: userID,
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
                        filtercolor: req.body.backgroundColor,
                        priceTotal: req.body.priceTotal,
                        remiseTotal: req.body.remiseTotal
                    }, {
                        new: true
                    })

                    await reservation.save().then(resrve => {
                        res.status(201).json({
                            message: 'reservation modifier avec success ! ',
                            resp: resrve
                        })
                    }).catch(err => {
                        res.status(500).send(err)
                    })



                }).catch(err => {
                    res.status(500).send(err)
                })

            })

            .catch(err => res.status(500).send(err))


        } else {

            await reservationModel.findOne({
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
                        }
                    ]
                }]

            }).then(async resp => {

                if (resp) return res.status(400).json({ message: 'la date de reservation est deja existe !' })
                const userID = data.clientID;
                const roomID = data.roomID;
                const User = await userModel.findByIdAndUpdate({ _id: userID }, {
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    number_phone: req.body.number_phone
                }, {
                    new: true
                });

                await User.save().then(async user => {

                        const Room = await roomModel.findByIdAndUpdate({ _id: roomID }, {
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
                            DOUBLE_HAUTE_SAISON_PRICE: req.body.DOUBLE_HAUTE_SAISON,
                        }, { new: true });
                        await Room.save().then(async result => {

                            const reservation = await reservationModel.findByIdAndUpdate({ _id: id }, {
                                type: req.body.roomType,
                                status_reservation: req.body.status_reservation,
                                roomID: result._id,
                                number_guests: 0,
                                number_children: req.body.number_children,
                                last: req.body.last,
                                clientID: userID,
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
                                color: req.body.backgroundColor
                            }, {
                                new: true
                            })

                            await reservation.save().then(resrve => {
                                res.status(201).json({
                                    message: 'reservation modifier avec success ! ',
                                    resp: resrve
                                })
                            }).catch(err => {
                                res.status(500).send(err)
                            })



                        }).catch(err => {
                            res.status(500).send(err)
                        })





                    })
                    .catch(err => res.status(500).send(err))

            }).catch(err => {
                res.status(500).send(err)
            })

        }






    })


}


/* update status of rooms  */

module.exports.updateRoomStatus = async(req, res) => {
    const id = req.params.id;
    const status = req.body.status;
    const backgroundColor = req.body.backgroundColor;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send("Id not valid");
    }
    const room = await roomModel.findByIdAndUpdate({ _id: id }, { status: status, backgroundColor: backgroundColor }, { new: true });
    await room
        .save()
        .then((result) => {
            res.status(201).json({
                message: "Updating status successfully !",
                roomInfos: result,
            });
        })
        .catch((errors) => {
            res.status(404).send(errors);
        });
};


// retrieve
exports.retrieve = async(req, res) => {
    var { id } = req.params;
    if (!id) {
        res.status(400).json({ message: 'id can not be empty' });
    }
    try {
        var reservation = await reservationModel.findById(id);
        res.status(200).json(reservation);
    } catch (error) {

        res.status(200).json({ error });
    }
};

// update
exports.update = (req, res) => {
    id = req.params.id;
    if (!req.body) {
        res.status(400).json({ message: 'content can not be empty' });
    }
    reservationModel
        .findByIdAndUpdate(id, req.body)
        .then(async(data) => {
            if (!data) {
                res.status(404).send({
                    message: 'cannot update reserveration',
                });
            } else {
                reservation = await reservationModel.findById(data._id);
                reservation.price = 0;
                if (
                    reservation.status == 'ANNULER' ||
                    reservation.status == 'REMBOURSSE'
                ) {
                    old_room = await roomModel.findById(data.roomID);
                    if (old_room) {
                        old_room.status = 'LIBRE';
                        await old_room.save();
                    }
                } else {
                    // calculate price
                    room = await roomModel.findById(reservation.roomID);
                    if (room) {
                        // case of room changed
                        if (data && room._id != data.roomID) {
                            old_room = await roomModel.findById(data.roomID);
                            old_room.status = 'LIBRE';
                            await old_room.save();
                        }

                        var number_of_days = 1;
                        if (req.body.startDate && req.body.endDate) {
                            var startDate = Date.parse(req.body.startDate);
                            var endDate = Date.parse(req.body.endDate);
                            number_of_days = endDate - startDate;
                            number_of_days = Math.floor(number_of_days / (1000 * 60 * 60 * 24));
                        }
                        reservation.price =
                            (parseFloat(reservation.price) + parseFloat(room[reservation.tarif])) * number_of_days;
                        room.status = 'RESERVE';
                        await room.save();
                    }
                    plat = await platModel.findById(reservation.platID);
                    if (plat) {
                        reservation.price =
                            parseFloat(reservation.price) + parseFloat(plat.price);
                    }
                    menu = await menuModel.findById(reservation.menuID);
                    if (menu) {
                        reservation.price =
                            parseFloat(reservation.price) + parseFloat(menu.price);
                    }
                }

                reservation = await reservation.save();

                res.status(200).send({
                    message: 'reservation was updated successfully !',
                    reservation: reservation,
                });
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: 'Error updating reservation ',
                error: err,
            });
        });
};

// delete and update user status
exports.delete = async(req, res) => {
    var { id } = req.params;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send("Id not valid");
    }
    if (!id) {
        res.status(400).json({ message: 'id can not be empty' });
    }
    try {
        const isActive = false;
        await reservationModel.findByIdAndUpdate({ _id: id }, { isActive: isActive }, { new: true }).then(async reservation => {

            await userModel.findByIdAndUpdate({ _id: reservation.clientID }, { isActive: isActive }, { new: true }).then(async user => {
                res.status(201).send({
                    message: "reservation deleted",
                    reservation: reservation,
                    user: user
                })

            }).catch(err => {
                res.status(500).send(err)
            })
        }).catch(err => {
            res.status(500).send(err)
        })

    } catch (error) {
        res.status(500).json({ error });
    }
};


//get list of rooms reservation 
exports.getListReservation = async(req, res) => {
    await reservationModel.find({
            type: 'room',
            isActive: true
        })
        .populate('roomID')
        .populate('clientID')
        .populate([{
            path: 'listmenuID',
            model: 'Menu',
            select: 'comment typeRepas price  menuList  number_heure remise',

        }, ])

    .then(reservations => {
        res.status(200).json(reservations.slice(0,2))
    }).catch(err => {
        res.status(500).send(err)
    })
}


/* filter reservation by status */
module.exports.getReservationByStatus = async(req, res) => {
    const { color } = req.query;
    if (color) {
        await reservationModel.find({
                "filtercolor": color,
                "isActive": true,
                "type": "room"
            })
            .populate('roomID')
            .populate('clientID')
            .populate([{
                path: 'listmenuID',
                model: 'Menu',
                select: 'comment typeRepas price  menuList ',

            }, ])
            .then(async(reservations) => {

                res.status(200).send(reservations)

            })
            .catch((errors) => {
                res.status(500).send(errors);
            });
    } else {
        await reservationModel.find({
                "isActive": true,
                "type": "room"
            })
            .populate('roomID')
            .populate('clientID')
            .populate([{
                path: 'listmenuID',
                model: 'Menu',
                select: 'comment typeRepas price  menuList',

            }, ])
            .then(async(reservations) => {

                res.status(200).send(reservations)
            })
            .catch((errors) => {
                res.status(404).send(errors);
            });
    }



}


/*creation d'une api pour remplir la bd */
module.exports.createMenu = async(req, res) => {
    const menu = new menuModel({
        name: "Enfant Bas saison",
        price: 28,
        isPersonalize: false,
        description: "bas"
    })
    await menu.save().then(menu => {
        res.status(201).send(menu)
    }).catch(err => {
        res.status(500).send(err)
    })
}


/*create standard reservation menu*/
exports.createReservationMenu = async(req, res) => {


    if (!req.body) {
        res.status(400).json({ message: 'content can not be empty' });
    }


    const us = await userModel.findOne({
        number_phone: req.body.number_phone,
        isActive: "true"
    });
    if (us) {

        const newRes = new reservationModel({
            type: req.body.type,
            status_reservation: req.body.status,
            number_guests: req.body.number_guests,
            clientID: us._id,
            comment: req.body.comment,
            price: req.body.price,
            start: req.body.startDate,
            menuID: req.body.menuID,
            number_heure: req.body.number_heure,
            typeRepas: req.body.entreSta,
            nb_eau: req.body.nb_eau,
            nb_soda: req.body.nb_soda,
            remise: req.body.remise
        })
        newRes.save().then(data => {
            res.status(201).json({
                message: "menu reserver avec success",
                data: data
            })
        }).catch(err => {
            res.status(500).send(err)
        })
    } else {

        const user = new userModel({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            number_phone: req.body.number_phone,
            email: req.body.email
        })

        await user.save().then(async user => {

                const newRes = new reservationModel({
                    type: req.body.type,
                    status_reservation: req.body.status,
                    number_guests: req.body.number_guests,
                    clientID: user._id,
                    comment: req.body.comment,
                    price: req.body.price,
                    start: req.body.startDate,
                    menuID: req.body.menuID,
                    number_heure: req.body.number_heure,
                    typeRepas: req.body.entreSta,
                    nb_eau: req.body.nb_eau,
                    nb_soda: req.body.nb_soda,
                    remise: req.body.remise
                })
                newRes.save().then(data => {
                    res.status(201).json({
                        message: "menu reserver avec success",
                        data: data
                    })
                }).catch(err => {
                    res.status(500).send(err)
                })
            })
            .catch(err => res.status(500).send(err))
    }

}


/*update standard reservation menu*/

exports.updateStandardReservationMenu = async(req, res) => {
    const id = req.params.id;



    if (!ObjectID.isValid(id)) {
        return res.status(404).send("Id not valid");
    }

    if (!req.body) {
        res.status(400).json({ message: 'content can not be empty' });
    }


    await reservationModel.findOne({ _id: id }).then(async data => {

        if (!data) return res.status(400).json({ message: 'cannot find reservation !' })
            // test pour connaitre si la date modifier ou nn 



        const User = await userModel.findByIdAndUpdate({ _id: data.clientID }, {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            number_phone: req.body.number_phone,
            email: req.body.email
        }, {
            new: true
        });

        await User.save().then(async user => {


            const reservation = await reservationModel.findByIdAndUpdate({ _id: id }, {
                type: req.body.type,
                status_reservation: req.body.status,
                number_guests: req.body.number_guests,
                clientID: user._id,
                comment: req.body.comment,
                price: req.body.price,
                start: req.body.startDate,
                typeRepas: req.body.typeRepas,
                number_heure: req.body.number_heure,
                menuID: req.body.menuID,
                nb_eau: req.body.nb_eau,
                nb_soda: req.body.nb_soda,
                remise: req.body.remise
            }, {
                new: true
            })

            await reservation.save().then(resrve => {
                res.status(201).json({
                    message: 'reservation modifier avec success ! ',
                    resp: resrve
                })
            }).catch(err => {
                res.status(500).send(err)
            })



        }).catch(err => {
            res.status(500).send(err)
        })

    })

    .catch(err => res.status(500).send(err))

}

//get list of menus reservation 
exports.getListReservationMenus = async(req, res) => {
    await reservationModel.find({
            type: 'menu',
            isActive: true,
        })
        .populate('menuID')
        .populate('clientID')
        .sort({ start: -1 })
        .then(reservations => {
            res.status(200).json(reservations)
        }).catch(err => {
            res.status(500).send(err)
        })
}

//get list of rooms reservation by clientID
exports.getRoomsListByClienID = async(req, res) => {

    await reservationModel.find({
            type: 'room',
            isActive: true
        })
        .populate('menuID')
        .populate('clientID')
        .populate('roomID')
        .then(reservations => {
            res.status(200).json(reservations)
        }).catch(err => {
            res.status(500).send(err)
        })
}

//create Personalize reservation menu
exports.createPersoReservationMenu = async(req, res) => {



    const perso = new menuModel({
        menuList: req.body.menuList,
        comment: req.body.comment,
        isPersonalize: req.body.isPersonalize,
        price: req.body.price,
        typeRepas: req.body.entrePerso,
        number_heure: req.body.number_heure,
        remise: req.body.remise
    })
    await perso.save().then(async perso => {

        const resv = await reservationModel.find({
            type: 'room',
            clientID: req.body.clientID
        });

        await resv[0].listmenuID.push(perso._id);
        return resv[0].save()
            .then(async(reservation) => {

                res.status(201).json({
                    message: "Menu reserver avec success",
                    data: reservation
                })

            })
            .then(resp => {
                    res.status(201).send(resp)
                }

            )


    }).catch(err => {
        res.status(500).send(err)
    })

}

//update Personalize reservation menu
exports.updatePersoReservationMenu = async(req, res) => {
    let id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send("Id not valid");
    }

    if (!req.body) {
        res.status(400).json({ message: 'content can not be empty' });
    }

    const menuPerso = await menuModel.findByIdAndUpdate({ _id: id }, {
        menuList: req.body.menuList,
        comment: req.body.comment,
        isPersonalize: req.body.isPersonalize,
        price: req.body.price,
        typeRepas: req.body.entrePerso,
        number_heure: req.body.number_heure,
        remise: req.body.remise
    }, {
        new: true
    });

    await menuPerso.save().then(async perso => {
        res.status(201).json({
            message: 'reservation modifier avec success',
            data: perso
        })

    }).catch(err => {
        res.status(500).send(err)
    })
}

//delete menu from room reservation 
exports.deletePersoMenu = async(req, res) => {
    let id = req.params.id;


    if (!ObjectID.isValid(id)) {
        return res.status(404).send("Id not valid");
    }


    await reservationModel.findOne({
            type: 'room',
            _id: id
        })
        .then(async perso => {


            await perso.listmenuID.pull(perso.listmenuID[0], perso.listmenuID[1], perso.listmenuID[2], perso.listmenuID[3]);


            return perso.save()
                .then(async(reservation) => {

                    res.status(201).json({
                        message: "Menu supprimer avec success",
                        data: reservation
                    })

                })
                .then(resp => {
                    res.status(201).send(resp)
                })
        })

}

//get list of rooms by names
module.exports.getRoomsByNames = async(req, res) => {
    const { name } = req.query;



    if (name) {
        await reservationModel.find({
                "roomName": name,
                "isActive": true,
                "type": "room"
            })
            .populate('roomID')
            .populate('clientID')
            .then(async(reservations) => {

                res.status(200).send(reservations)

            })
            .catch((errors) => {
                res.status(500).send(errors);
            });
    }





}

//get reservation by id 
exports.getRoomReservationById = async(req, res) => {
    let id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send("Id not valid");
    }

    await reservationModel.find({
            _id: id,
            type: 'room',
            isActive: true
        })
        .populate('roomID')
        .populate('clientID')
        .populate([{
            path: 'listmenuID',
            model: 'Menu',
            select: 'comment typeRepas price  menuList  number_heure remise',

        }, ])

    .then(reservations => {
        res.status(200).json(reservations)
    }).catch(err => {
        res.status(500).send(err)
    })
}

//get Toatal price room reservation by id 
exports.getTotalRoomPriceById = async(req, res) => {
    let id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send("Id not valid");
    }

    await reservationModel.find({
            _id: id,
            type: 'room',
            isActive: true
        })
        .populate('roomID')
        .populate('clientID')
        .populate([{
            path: 'listmenuID',
            model: 'Menu',
            select: 'comment typeRepas price  menuList  number_heure remise',

        }, ])

    .then(reservations => {


        if (reservations[0].listmenuID.length == 0) {

            let roomP = +reservations[0].price;


            return res.status(200).json(roomP)
        }


        if ((reservations[0].listmenuID.length != 1) && (reservations[0].listmenuID[0].remise != undefined) && (reservations[0].listmenuID[1].remise != undefined)) {
            let roomP = +reservations[0].price + +reservations[0].listmenuID[0].remise + +reservations[0].listmenuID[1].remise;


            return res.status(200).json(roomP)
        }

        if (reservations[0].listmenuID.length === 1) {

            let roomP = +reservations[0].price + +reservations[0].listmenuID[0].remise;


            return res.status(200).json(roomP)
        }





    }).catch(err => {
        res.status(500).send(err)
    })
}

//check room reservation
exports.checkRoomReservation = async(req, res) => {
    const { date } = req.query;
    const resrvResp = await reservationModel.find({
        "isActive": true,
        $and: [{
            $or: [{
                "startFiltre": date,
                "startFiltre": { $lte: date },
                "endFiltre": { $gte: date },
            }, ]
        }]

    })

    if (resrvResp.length != 0) {
        return res.status(200).json({ message: 'la date de réservation est déjà existé vous voulez continuer?' })
    }


}



// new api to chech booking en linge 
exports.checkBookingEnligne = async(req, res) => {
    // console.log("data>>>", req.body)
    const { startDate } = req.body;
    const { endDate } = req.body;
    const { room } = req.body;
    //   console.log(startDate, endDate, room);
    let filter_type;
    if (room == 'all') {
       filter_type = ['Marabou', 'Brecon', 'Amorpha', 'Ruppia', 'Ciconia', 'Colony', 'Bonelli', 'Cicogne']
    } else {
       filter_type=[room]
    }
    await reservationModel.find({
        "roomName": room,
        "isActive": true,
        $and: [{
            $or: [{
                     "end": {$gte: startDate, $lte: endDate},
                },
		    {
                    "start": {$gte: startDate, $lte: endDate},
       
                },
		    {
			"start": {$lte: startDate},
			 "end": { $gte: endDate}
		}
            ]
        }]

    }).then(async resp => {

        if (resp.length != 0) {
            return res.status(201).json({ message: 'Chambre non disponible!', resp })
        } else {
            return res.status(200).json({ message: 'la date est disponible !', resp })
        }
    })

}

// check all reservation and return available suits
exports.checkBookingEnligneAllSuits = async(req, res) => {
    const { startDate } = req.body;
    const { endDate } = req.body;
    const { room } = req.body;
    if (!startDate || !endDate || endDate < new Date(now).getDate() || startDate > endDate) {
        return res.status(400).json({ message: "Input date invalide"}) 
    }
    let filter_type;
    if (room == 'all') {
       filter_type = ['Marabou', 'Brecon', 'Amorpha', 'Ruppia', 'Ciconia', 'Colony', 'Bonelli', 'Cicogne']
    } else {
       filter_type=[room]
    }
    await reservationModel.find({
        "roomName": filter_type,
        "isActive": true,
        $and: [{
            $or: [{
                     "end": {$gte: startDate, $lte: endDate},
                },
		    {
                    "start": {$gte: startDate, $lte: endDate},
       
                },
		    {
			"start": {$lte: startDate},
			 "end": { $gte: endDate}
		}
            ]
        }]

    }).then(async resp => {
        let array_suits = [];
        resp.forEach(element => {
            array_suits.push(element.roomName)
        });
        let array_suits_filter = Array.from(new Set(array_suits))
        const available_suits = await suitsModel.find({
        title: { $nin : array_suits_filter }})
        
        if (available_suits.length == 0) {
            return res.status(400).json({ message: "Aucun suite n'est disponible !", available_suits })
        } else {
            return res.status(201).json({ message: 'la date est disponible !', available_suits })
        }
    })

}


// En ligne reservation and send email 
exports.reservationEnligneAndSendEmail = async(req, res) => {
     console.log("email to sent>>>", req.body)
    let mailOption = {
        from: process.env.EMAIL,
        to: ['islemhmz1998@gmail.com'],
	//cc: ['islemhmz1998@gmail.com'],
        subject: 'Reservation de chambre',
        html: `
        <div><h2>Les informations du client</h2>
        <pre>Nom: ${req.body.nom}</pre>
        <pre>Prenom: ${req.body.prenom}</pre>
        <pre>la date d'arriver: ${req.body.checkin}</pre>
        <pre>la date de depart: ${req.body.checkout}</pre>
        <pre>le nom de la chambre: ${req.body.room}</pre>
        <pre>Type de la chambre: ${req.body.type}</pre>
        <pre>Le nombre de personne: ${req.body.number_persone}</pre>
        <pre>Email du client: ${req.body.email}</pre>
        <pre>Le numero de téléphone: ${req.body.phone_number}</pre>
        </div>
        
       `
    }


    let transporter = nodemailer.createTransport({
 
	    host: "ssl0.ovh.net",
   port: 465, secure: true,
    auth: {
        user: process.env.EMAIL,
       pass: process.env.PASSWORD    }
});


    transporter.sendMail(mailOption, function(err, info) {
        if (err) {
            // console.log('Error', err);
            return res.status(400).json({ message: err, x:[process.env.PASSWORD, process.env.EMAIL] })
        } else {
            //  console.log('Message sent')
            return res.status(200).json({ message: 'reservation fait avec success!' })
        }
    })


    let mailOption2 = {
        from: process.env.EMAIL,
        to: [req.body.email,'islemhmz1998@gmail.com'],
        subject: 'Votre réservation est confirmée!',
        html: `
        <div><h2>${req.body.room}</h2>
        <pre>Nom: ${req.body.nom}</pre>
        <pre>Prenom: ${req.body.prenom}</pre>
        <pre>Le numero de téléphone: ${req.body.phone_number}</pre>
        <pre>Adresse email: ${req.body.email}</pre>
        <pre>le nom de la chambre: ${req.body.room}</pre>
        <pre>la date d'arriver: ${req.body.checkin}</pre>
        <pre>la date de depart: ${req.body.checkout}</pre>
        <pre>Le nombre de personne: ${req.body.number_persone}</pre>
        <pre>Type de la chambre: ${req.body.type}</pre>
        <pre>Tarif de la chambre: ${req.body.tarif}DT</pre>
        </div>
        
       `
    }

}


// send email from contacte  
exports.contacteEmail = async(req, res) => {

    // console.log("email to sent from contacte>>>", req.body)


    let mailOption = {
        from: 'wahabi.contact.tech@gmail.com',
        to: "darichkel@gmail.com",
        subject: 'Reclamation',
        html: `
            <div><h2>Reclamation du client</h2>
            <pre>Nom: ${req.body.name}</pre>
            <pre>Adresse email: ${req.body.email}</pre>
            <pre>Le numero de téléphone: ${req.body.phone}</pre>
            <pre>Sujet: ${req.body.subject}</pre>
            <pre>Message: ${req.body.message}</pre>
            
            </div>
            
           `
    }


    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {

            user: process.env.EMAIL,
            pass: process.env.PASSWORD,

        }
    });

    transporter.sendMail(mailOption, function(err, info) {
        if (err) {
            // console.log('Error', err);
            return res.status(400).json({ message: 'bad request!' })
        } else {
            // console.log('Message sent')
            return res.status(200).json({ message: 'Votre réclamation est envoyée avec succès' })
        }
    })


}




//get list of rooms reservation site darichkeul 
exports.getListReservationRoom = async(req, res) => {
    const { room } = req.query;
     let filter_type;
     if (room == 'all') {
        filter_type = ['Marabou', 'Brecon', 'Amorpha', 'Ruppia', 'Ciconia', 'Colony', 'Bonelli', 'Cicogne']
     } else {
        filter_type=[room]
     }
    await reservationModel.find({
        type: 'room',
        isActive: true,
        roomName: { $in : filter_type }
    })
    .then(reservations => {
        array = []
        arrayOfRange = []
        arrayToSend = [];
        a = []
        const dateArray = [];
        reservations.map((item) => {
                this.list1 = item.startFiltre
                this.list2 = item.endFiltre
                array.push(this.list1, this.list2)
                const range = dateRange(item.startFiltre, item.endFiltre, 1)
                arrayOfRange.push(range)
            })
        res.status(200).json(Array.from(new Set(arrayOfRange)))
    }).catch(err => {
        res.status(500).send(err)
    })
}


function dateRange(startDate, endDate, steps) {
    const dateArray = [];
    let currentDate = new Date(startDate);

    while (currentDate <= new Date(endDate)) {
        dateArray.push(new Date(currentDate));
        // Use UTC date to prevent problems with time zones and DST
        currentDate.setUTCDate(currentDate.getUTCDate() + steps);
    }
    return dateArray;


}
