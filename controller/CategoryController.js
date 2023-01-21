const categoryModel = require('../models/Category');
const depotModel = require('../models/Depot');
const familyModel = require('../models/Family');
const typeModel = require('../models/Type');


//create new Depot
exports.createCategory = async(req, res) => {

    let id = req.body.idDepot;
    const filePath = process.env.BASE_URL + req.file.path;

    new categoryModel({
            name: req.body.name,
            img: filePath,
            description: req.body.description,
            idDepot: id
        })
        .save().then(async category => {
            await depotModel.findById({ _id: id }).then(async depot => {
                await depot.listCategorys.push(category);
                depot.save();
                res.status(201).json(category);
            }).catch(err => {
                res.status(500).send(err)
            })

        })
}



//get list categorie by depot
exports.listOfCategorysByDepot = async(req, res) => {

    const { name } = req.query;
    try {
        var depots = await depotModel.find({ name: name })
            .populate([{
                path: 'listCategorys',
                model: 'Category',
                select: '_id name img',

            }])
        res.status(200).json(depots);
    } catch (error) {

        res.status(200).json({ error })
    }
}




//get list articles by depot
exports.listOfArticlesByDepot = async(req, res) => {

    const { name } = req.query;
    try {
        var depots = await depotModel.find({ name: name })
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
                        populate: [{
                            path: 'listArticle',
                            model: 'Article',
                            select: 'id name marque quantity img',
                        }]
                    }]
                }]

            }])
        res.status(200).json(depots);
    } catch (error) {

        res.status(200).json({ error })
    }
}





//get list family by categorie
exports.listOfAllFamilyByCategory = async(req, res) => {
    const { name } = req.query;
    try {
        var family = await categoryModel.find({ name: name })
            .populate("idDepot")
            .populate([{
                path: 'listFamily',
                model: 'Family',
                select: 'name img',
                populate: [{
                    path: 'listType',
                    model: 'Type',
                    select: 'name img',
                }]

            }])
        res.status(200).json(family);
    } catch (error) {

        res.status(200).json({ error })
    }
}


//get list types by family
exports.listOfTypesByFamily = async(req, res) => {
    const { name } = req.query;
    try {
        var family = await familyModel.find({ name: name })
            .populate([{
                path: 'idCategory',
                model: 'Category',
                select: 'name',
                populate: [{
                    path: 'idDepot',
                    model: 'Depot',
                    select: 'name',
                }]

            }])
            .populate([{
                path: 'listType',
                model: 'Type',
                select: 'name img',

            }])
        res.status(200).json(family);
    } catch (error) {

        res.status(200).json({ error })
    }
}


//get list articles by type
exports.listOfArticlesByType = async(req, res) => {
    const { name } = req.query;
    try {
        var type = await typeModel.find({ name: name })

        .populate([{
                path: 'idFamily',
                model: 'Family',
                select: 'name idCategory',
                populate: [{
                    path: 'idCategory',
                    model: 'Category',
                    select: 'name',
                    populate: [{
                        path: 'idDepot',
                        model: 'Depot',
                        select: 'name',
                    }]
                }]

            }])
            .populate([{
                path: 'listArticle',
                model: 'Article',
                select: 'id name marque quantity img unity',

            }])
        res.status(200).json(type);
    } catch (error) {

        res.status(200).json({ error })
    }
}