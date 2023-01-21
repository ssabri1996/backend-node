const depotModel = require("../models/Depot");
const categoryModel = require("../models/Category");
const familyModel = require("../models/Family");

//create new Depot
exports.createDepot = async(req, res) => {
    const filePath = process.env.BASE_URL + req.file.path;
    const depot = new depotModel({
        name: req.body.name,
        img: filePath,
        description: req.body.description,
    });
    await depot
        .save()
        .then((depot) => {
            res.status(201).json(depot);
        })
        .catch((err) => {
            res.status(500).send(err);
        });
};

//get list depots
exports.listDepot = async(req, res) => {
    try {
        var depots = await depotModel.find({});
        res.status(200).json(depots);
    } catch (error) {
        res.status(200).json({ error });
    }
};

//get list categories from all depots
exports.listOfAllCategoryFromAllDepot = async(req, res) => {
    try {
        var depots = await depotModel.find({}).populate([{
            path: "listCategorys",
            model: "Category",
            select: "_id name img",
        }, ]);
        res.status(200).json(depots);
    } catch (error) {
        res.status(200).json({ error });
    }
};

//get list of all articles from all depots/categories
exports.listOfAllArticlesFromAllDepot = async(req, res) => {
    try {
        var depots = await depotModel.find({}).populate([{
            path: "listCategorys",
            model: "Category",
            select: "_id name img",
            populate: [{
                path: "listFamily",
                model: "Family",
                select: "name img",
                populate: [{
                    path: "listType",
                    model: "Type",
                    select: "name img",
                    populate: [{
                        path: "listArticle",
                        model: "Article",
                        select: "id name marque quantity img isHide unity",
                    }, ],
                }, ],
            }, ],
        }, ]);

        res.status(200).json(depots);
    } catch (error) {
        res.status(200).json({ error });
    }
};

//get list of all family from all depots
exports.listOfAllFamilyDepot = async(req, res) => {
    try {
        var depots = await depotModel.find({}).populate([{
            path: "listCategorys",
            model: "Category",
            select: "_id name img",
            populate: [{
                path: "listFamily",
                model: "Family",
                select: "name img",
            }, ],
        }, ]);
        res.status(200).json(depots);
    } catch (error) {
        res.status(200).json({ error });
    }
};

//get list of all articles by categorie
exports.listOfAllArticlesByCategorie = async(req, res) => {
    const { name } = req.query;

    try {
        var depots = await depotModel.find({ name: name }).populate([{
            path: "listCategorys",
            model: "Category",
            select: "_id name img",
            populate: [{
                path: "listFamily",
                model: "Family",
                select: "name img",
                populate: [{
                    path: "listType",
                    model: "Type",
                    select: "name img",
                    populate: [{
                        path: "listArticle",
                        model: "Article",
                        select: "id name marque quantity img unity",
                    }, ],
                }, ],
            }, ],
        }, ]);
        res.status(200).json(depots);
    } catch (error) {
        res.status(200).json({ error });
    }
};

//get list of all family by depot
exports.listOfAllFamilyByDepot = async(req, res) => {
    const { name } = req.query;

    await categoryModel
        .findOne({ name: name })
        .then(async(categorie) => {

            var depots = await depotModel
                .findById({ _id: categorie.idDepot })
                .populate([{
                    path: "listCategorys",
                    model: "Category",
                    select: "_id name img",
                    populate: [{
                        path: "listFamily",
                        model: "Family",
                        select: "name img",
                    }, ],
                }, ]);
            res.status(200).json(depots);
        })
        .catch((err) => {
            res.status(500).send(err);
        });
};

//get list of all articles by family
exports.listOfAllArticlesByFamily = async(req, res) => {
    const { name } = req.query;

    await categoryModel
        .findOne({ name: name })
        .then(async(categorie) => {

            var depots = await depotModel
                .findById({ _id: categorie.idDepot })
                .populate([{
                    path: "listCategorys",
                    model: "Category",
                    select: "_id name img",
                    populate: [{
                        path: "listFamily",
                        model: "Family",
                        select: "name img",
                        populate: [{
                            path: "listType",
                            model: "Type",
                            select: "name img",
                            populate: [{
                                path: "listArticle",
                                model: "Article",
                                select: "id name marque quantity img unity",
                            }, ],
                        }, ],
                    }, ],
                }, ]);
            res.status(200).json(depots);
        })
        .catch((err) => {
            res.status(500).send(err);
        });
};

//get list of all types by category
exports.listOfAllTypesByCategory = async(req, res) => {
    const { name } = req.query;

    await familyModel
        .findOne({ name: name })
        .then(async(family) => {

            await categoryModel
                .findById({ _id: family.idCategory })
                .then(async(category) => {

                    var depots = await depotModel
                        .findById({ _id: category.idDepot })
                        .populate([{
                            path: "listCategorys",
                            model: "Category",
                            select: "_id name img",
                            populate: [{
                                path: "listFamily",
                                model: "Family",
                                select: "name img",
                                populate: [{
                                    path: "listType",
                                    model: "Type",
                                    select: "name img",
                                }, ],
                            }, ],
                        }, ]);

                    res.status(200).json(depots);
                })
                .catch((err) => {
                    res.status(500).send(error);
                });
        })
        .catch((err) => {
            res.status(500).send(err);
        });
};

//get list of all types by category2
exports.listOfAllTypesByCategory2 = async(req, res) => {
    const { name } = req.query;

    await familyModel
        .findOne({ name: name })
        .then(async(family) => {

            await categoryModel
                .findById({ _id: family.idCategory })
                .then(async(category) => {


                    var depots = await depotModel
                        .findById({ _id: category.idDepot })
                        .populate([{
                            path: "listCategorys",
                            model: "Category",
                            select: "_id name img",
                            populate: [{
                                path: "listFamily",
                                model: "Family",
                                select: "name img",
                                populate: [{
                                    path: "listType",
                                    model: "Type",
                                    select: "name img",
                                    populate: [{
                                        path: "listArticle",
                                        model: "Article",
                                        select: "id name marque quantity img unity",
                                    }, ],
                                }, ],
                            }, ],
                        }, ]);

                    res.status(200).json(depots);
                })
                .catch((err) => {
                    res.status(500).send(error);
                });
        })
        .catch((err) => {
            res.status(500).send(err);
        });
};