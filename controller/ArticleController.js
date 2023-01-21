const typeModel = require('../models/Type');
const articleModel = require('../models/Article');
const { ObjectID } = require("mongodb");

//create new Article
exports.createArticle = async(req, res) => {

    let id = req.body.idType;
    const filePath = process.env.BASE_URL + req.file.path;

    new articleModel({
            name: req.body.name,
            img: filePath,
            marque: req.body.marque,
            quantity: req.body.quantity,
            unity: req.body.unity,
            description: req.body.description,
            idType: id
        })
        .save().then(async article => {
            await typeModel.findById({ _id: id }).then(async type => {
                await type.listArticle.push(article);
                type.save();
                res.status(201).json(article);
            }).catch(err => {
                res.status(500).send(err)
            })

        })
}


//get list articles
exports.listOfArticles = async(req, res) => {

    var article = await articleModel.find()
        .populate([{
            path: 'idType',
            model: 'Type',
            select: '_id name img',
            populate: [{
                path: 'idFamily',
                model: 'Family',
                select: '_id name img',
                populate: [{
                    path: 'idCategory',
                    model: 'Category',
                    select: '_id name img',
                    populate: [{
                        path: 'idDepot',
                        model: 'Depot',
                        select: '_id name img',
                    }]
                }]
            }]

        }])
        .then(async article => {

            res.status(200).send(article);
        }).catch(err => {
            res.status(500).send(err);
        })
}



//get article by id
exports.getArticleById = async(req, res) => {

    const id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send("Id not valid");
    }

    await articleModel.findById({ _id: id })
        .populate([{
            path: 'idType',
            model: 'Type',
            select: '_id name img',
            populate: [{
                path: 'idFamily',
                model: 'Family',
                select: '_id name img',
                populate: [{
                    path: 'idCategory',
                    model: 'Category',
                    select: '_id name img',
                    populate: [{
                        path: 'idDepot',
                        model: 'Depot',
                        select: '_id name img',
                    }]
                }]
            }]

        }])
        .then(async article => {

            res.status(200).send(article);
        }).catch(err => {
            res.status(500).send(err);
        })
}
