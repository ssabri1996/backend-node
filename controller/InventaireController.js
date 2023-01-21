const inventaireModel = require("../models/Inventaire");

//create new inventaire
exports.createInventaire = async(req, res) => {
    new inventaireModel(req.body.inventaire)
        .save()
        .then(async(inventaire) => {
            res.status(201).json(inventaire);
        })
        .catch((err) => {
            res.status(500).send(err);
        });
};

// get all inventaires
exports.getInventaires = async(req, res) => {
    try {
        var inventaires = await inventaireModel.find({}).populate("clientID");
        res.status(200).json(inventaires);
    } catch (error) {
        res.status(200).json({ error });
    }
};

// update inventaire
exports.update = (req, res) => {
    id = req.params.id;
    if (!req.body) {
        res.status(400).json({ message: "content can not be empty" });
    }
    inventaireModel
        .findByIdAndUpdate(id, req.body)
        .then(async(data) => {
            if (!data) {
                res.status(404).send({
                    message: "cannot update inventaire",
                });
            } else {
                inventaire = await inventaireModel.findById(data._id);
                res.status(200).send({
                    message: "inventaire was updated successfully !",
                    inventaire: inventaire,
                });
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: "Error updating inventaire ",
                error: err,
            });
        });
};

// delete inventaire
exports.delete = async(req, res) => {
    var { id } = req.params;
    if (!id) {
        res.status(400).json({ message: "id can not be empty" });
    }
    try {
        await inventaireModel.findByIdAndDelete(id);
        res.status(200).json({ message: "inventaire deleted" });
    } catch (error) {
        res.status(500).json({ error });
    }
};

// retrieve inventaire
exports.retrieve = async(req, res) => {
    var { id } = req.params;
    if (!id) {
        res.status(400).json({ message: "id can not be empty" });
    }
    try {
        var inventaire = await inventaireModel.findById(id);
        res.status(200).json(inventaire);
    } catch (error) {
        res.status(200).json({ error });
    }
};