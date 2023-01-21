const familyModel = require('../models/Family');
const typeModel = require('../models/Type');


//create new Type
exports.createType = async(req, res) => {

    let id = req.body.idFamily;
    const filePath = process.env.BASE_URL + req.file.path;
    new typeModel({
            name: req.body.name,
            img: filePath,
            description: req.body.description,
            idFamily: id

        })
        .save().then(async type => {
            await familyModel.findById({ _id: id }).then(async family => {
                await family.listType.push(type);
                family.save();
                res.status(201).json(type);
            }).catch(err => {
                res.status(500).send(err)
            })

        })
}