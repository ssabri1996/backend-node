const roomModel = require('../models/Room');

// list
exports.list = async(req, res) => {
    try {
        var room = await roomModel.find({...req.query });
        res.status(200).json(room);
    } catch (error) {

        res.status(200).json({ error })
    }
}

// create
exports.create = async(req, res) => {
    if (!req.body) {
        res.status(400).json({ message: 'content can not be empty' })
    }
    var room = new roomModel(req.body);
    try {
        room = await room.save();
        res.status(200).json({
            message: "room was created successfully",
            room: room,
        });
    } catch (error) {
        res.status(500).json({ error })
    }
}

// retrieve
exports.retrieve = async(req, res) => {
    var { id } = req.params;
    if (!id) {
        res.status(400).json({ message: 'id can not be empty' })
    }
    try {
        var room = await roomModel.findById(id);
        res.status(200).json(room);
    } catch (error) {

        res.status(200).json({ error })
    }
}

// update
exports.update = (req, res) => {
    id = req.params.id;
    if (!req.body) {
        res.status(400).json({ message: 'content can not be empty' })
    }
    roomModel.findByIdAndUpdate(id, req.body).then(async(data) => {
        if (!data) {
            res.status(404).send({
                message: 'cannot update reserveration'
            })
        } else {
            room = await roomModel.findById(data._id);
            res.status(200).send({
                message: 'room was updated successfully !',
                room: room
            });
        }
    }).catch(err => {
        res.status(500).send({
            message: "Error updating room ",
            error: err
        })
    })

}

// delete
exports.delete = async(req, res) => {
    var { id } = req.params;
    if (!id) {
        res.status(400).json({ message: 'id can not be empty' })
    }
    try {
        var room = await roomModel.findByIdAndDelete(id);
        res.status(200).json({ message: 'room deleted' })
    } catch (error) {
        res.status(500).json({ error })

    }
}



//crete basic rooms
exports.createRooms = async(req, res) => {


    const room = new roomModel({
        name: req.body.name,
        number_places: 0,
        singleBprice: req.body.singleBprice,
        singleHprice: req.body.singleHprice,
        doubleBprice: req.body.doubleBprice,
        doubleHprice: req.body.doubleHprice,
        isNormal: req.body.isNormal,
    })
    await room.save().then(rooms => {
        res.status(201).json(rooms);
    }).catch(err => {
        res.status(500).send(err)
    })
}



//get list of rooms by names
exports.getStandardRoomsByName = async(req, res) => {
    const { name } = req.query;



    if (name) {
        await roomModel.find({
            "name": name,
            "isNormal": true,

        })

        .then(async(room) => {

                res.status(200).json(room)

            })
            .catch((errors) => {
                res.status(500).send(errors);
            });
    }





}
