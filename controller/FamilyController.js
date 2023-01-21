const categoryModel = require('../models/Category');
const familyModel = require('../models/Family');
const depotModel = require('../models/Depot');

//create new Familly
exports.createFamily = async(req, res) => {

    let id = req.body.idCategory;
    const filePath = process.env.BASE_URL + req.file.path;

    new familyModel({
            name: req.body.name,
            img: filePath,
            description: req.body.description,
            idCategory: id

        })
        .save().then(async family => {
            await categoryModel.findById({ _id: id }).then(async category => {
                await category.listFamily.push(family);
                category.save();
                res.status(201).json(family);
            }).catch(err => {
                res.status(500).send(err)
            })

        })
}





//get list of all types from all depots/categories 
exports.listOfAllTypesFromAllDepot = async(req, res) => {
    try {
        var depots = await depotModel.find({})
            .populate([{
                path: 'listCategorys',
                model: 'Category',
                select: '_id name img',
                populate: [{
                    path: 'listFamily',
                    model: 'Family',
                    select: 'name img',
                    populate: [{
                        path: 'listType',
                        model: 'Type',
                        select: 'name img',
                    }]
                }]
            }])
        res.status(200).json(depots);
    } catch (error) {

        res.status(200).json({ error })
    }
}


exports.listOfAllFamilies = async(req, res) => {
    try {
        var depots = await familyModel.find({})

        res.status(200).json(depots);
    } catch (error) {

        res.status(200).json({ error })
    }
}

//get list articles by family
exports.listOfArticlesByFamily = async(req, res) => {

    const { name } = req.query;
    try {
        var depots = await familyModel.find({ name: name })
            .populate([{
                path: 'listType',
                model: 'Type',
                select: '_id name img',
                populate: [{
                    path: 'listArticle',
                    model: 'Article',
                    select: 'id name marque quantity img',
                }]
            }])
        res.status(200).json(depots);
    } catch (error) {

        res.status(200).json({ error })
    }
}