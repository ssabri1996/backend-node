const platModel = require('../models/Plat');

// list 
exports.list = async(req, res) => {
    try {
        var plat = await platModel.find({...req.query });
        res.status(200).json(plat);
    } catch (error) {

        res.status(200).json({ error })
    }
}

// create
exports.create = async(req, res) => {
    if (!req.body) {
        res.status(400).json({ message: 'content can not be empty' })
    }
    var plat = new platModel(req.body);
    try {
        plat = await plat.save();
        res.status(200).json({
            message: "plat was created successfully",
            plat: plat,
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
        var plat = await platModel.findById(id);
        res.status(200).json(plat);
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
    platModel.findByIdAndUpdate(id, req.body).then(async(data) => {
        if (!data) {
            res.status(404).send({
                message: 'cannot update reserveration'
            })
        } else {
            plat = await platModel.findById(data._id);
            res.status(200).send({
                message: 'plat was updated successfully !',
                plat: plat
            });
        }
    }).catch(err => {
        res.status(500).send({
            message: "Error updating plat ",
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
        var plat = await platModel.findByIdAndDelete(id);
        res.status(200).json({ message: 'plat deleted' })
    } catch (error) {
        res.status(500).json({ error })

    }
}

// get plats list by category 
exports.list = async(req, res) => {
    try {
        var platDesserts = await platModel.find({
            category: "Desserts",
            isActive: true
        });
        var platBoissons = await platModel.find({
            category: "Boissons",
            isActive: true
        });
        var platPates = await platModel.find({
            category: "Pates",
            isActive: true
        });

        var platSpecialistes = await platModel.find({
            category: "Specialistes",
            isActive: true
        });

        var platEntreeChaudes = await platModel.find({
            category: "EntreeChaudes",
            isActive: true
        });

        var platEntreeFeroids = await platModel.find({
            category: "EntreeFeroids",
            isActive: true
        });


        plats = [platDesserts, platBoissons, platPates, platSpecialistes, platEntreeChaudes, platEntreeFeroids]

        res.status(200).json(plats);
    } catch (error) {

        res.status(200).json({ error })
    }
}