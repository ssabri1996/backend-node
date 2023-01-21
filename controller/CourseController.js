const courseModel = require('../models/Course');
const { ObjectID } = require("mongodb");
const userModel = require('../models/User');
const articleModel = require('../models/Article');
const moment = require('moment')


//create new Course
exports.createCourse = async(req, res) => {


    new courseModel({
            code: req.body.code,
            date: req.body.date,
            articleList: req.body.articleList,
            types: req.body.types,
            price: req.body.price,
            clientID: req.body.clientID,
            person: req.body.person

        })
        .save().then(async course => {

            res.status(201).json(course);
        }).catch(err => {
            res.status(500).send(err)
        })




    let list = req.body.articleList;
    for (var i = 0; i < list.length; i++) {
        await articleModel.find({ _id: list[i]._id }).then(async resp => {

            if (resp.length > 0) {
                const article = await articleModel.findByIdAndUpdate({ _id: list[i]._id }, {
                    quantity: resp[0].quantity + list[i].quantity,

                }, {
                    new: true
                })

                await article.save()
                    .then(async(data) => {


                    }).catch(err => {
                        res.status(500).sebd(err);
                    })
            }

        })
    }



}

//get all list courses or get list by date range
exports.getlistCourses = async(req, res) => {

    const { from, to } = req.query;


    if (from && to) {



        try {

            var courses = await courseModel.aggregate([

                { "$match": { date: { $gte: from, $lte: to } } },

                {

                    "$group": {
                        "_id": { "month": { "$month": "$created_at" }, "year": { "$year": "$created_at" } },

                        "transactions": { "$push": "$$ROOT" }
                    },

                },
                { "$sort": { "month": -1, "year": -1 } }
            ])
            res.status(200).json(courses);
        } catch (error) {

            res.status(200).json({ error });
        }


    } else {
        try {
            // var courses = await courseModel.find({...req.query }).populate('clientID')
            var courses = await courseModel.aggregate([

                {

                    "$group": {
                        "_id": { "month": { "$month": "$created_at" }, "year": { "$year": "$created_at" } },

                        "transactions": { "$push": "$$ROOT" }
                    },

                },
                { "$sort": { "month": -1, "year": -1 } }
            ])


            res.status(200).json(courses);
        } catch (error) {

            res.status(200).json({ error });
        }
    }


};


//get list courses by month 
exports.getlistCoursesByMonth = async(req, res) => {
    const { number, year } = req.query;

    try {
        var courses = await courseModel.

        aggregate([{
                "$group": {
                    "_id": { "month": { "$month": "$created_at" }, "year": { "$year": "$created_at" } },
                    "transactions": { "$push": "$$ROOT" }
                }
            },
            { "$sort": { "month": -1, "year": -1 } }
        ])

        let obj = courses.find(obj => (obj._id.month == number && obj._id.year == year));

        res.status(200).json([obj]);
    } catch (error) {

        res.status(200).json({ error });
    }

}



// get list courses by min price and max price 
exports.getlistCoursesByPrice = async(req, res) => {

    const { prixMin, prixMax, person } = req.query;



    try {
        var courses = await courseModel.aggregate([

            {
                $match: { price: { $gte: +prixMin, $lte: +prixMax } }
            },

            /* {
                 $match: { person: person }
             },*/

            {

                "$group": {
                    "_id": { "month": { "$month": "$created_at" }, "year": { "$year": "$created_at" } },

                    "transactions": { "$push": "$$ROOT" }
                },

            },

            { "$sort": { "month": -1, "year": -1 } }
        ])



        res.status(200).json(courses);
    } catch (error) {

        res.status(200).json({ error });
    }

};


// get list courses by person
exports.getlistCoursesByPerson = async(req, res) => {

    const { person } = req.query;


    try {
        var courses = await courseModel.aggregate([

            {
                $match: { person: person }
            },

            {

                "$group": {
                    "_id": { "month": { "$month": "$created_at" }, "year": { "$year": "$created_at" } },

                    "transactions": { "$push": "$$ROOT" }
                },

            },

            { "$sort": { "month": -1, "year": -1 } }
        ])


        res.status(200).json(courses);
    } catch (error) {

        res.status(200).json({ error });
    }

};



// filtre list courses by multiple options 
exports.getlistCoursesByMuliplesOptions = async(req, res) => {

    const { prixMin, prixMax, from, to, person } = req.query;

    if (prixMin && prixMax && from && to && person) {

        /* try {
             var courses = await courseModel.find({
                 price: { $gte: prixMin, $lte: prixMax },
                 date: { $gte: from, $lte: to },
                 person: person
             }).populate('clientID')
             res.status(200).json(courses);
         } catch (error) {

             res.status(500).json({ error });
         }*/

        try {
            var courses = await courseModel.aggregate([

                {
                    $match: { price: { $gte: +prixMin, $lte: +prixMax }, person: person, date: { $gte: from, $lte: to } }
                },

                {

                    "$group": {
                        "_id": { "month": { "$month": "$created_at" }, "year": { "$year": "$created_at" } },

                        "transactions": { "$push": "$$ROOT" }
                    },

                },

                { "$sort": { "month": -1, "year": -1 } }
            ])


            res.status(200).json(courses);
        } catch (error) {

            res.status(200).json({ error });
        }



    }
};




// get course by id
exports.getCoursesById = async(req, res) => {

    const id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send("Id not valid");
    }

    try {
        var courses = await courseModel.findById({ _id: id }).populate("clientID")
        res.status(200).json(courses);
    } catch (error) {

        res.status(500).json({ error });
    }


};


// update course
exports.update = async(req, res) => {
    id = req.params.id;

    if (!req.body) {
        res.status(400).json({ message: 'content can not be empty' })
    }

    const user = await userModel.findById({ _id: req.body.clientID });



    if (user.isAdmin) {


        const course = await courseModel.findByIdAndUpdate({ _id: id }, {
            code: req.body.code,
            date: req.body.date,
            articleList: req.body.articleList,
            types: req.body.types,
            price: req.body.price,
            clientID: req.body.clientID

        }, {
            new: true
        })

        await course.save()
            .then(async(data) => {

                if (!data) {
                    res.status(404).send({
                        message: 'cannot update course'
                    })
                }
                res.status(200).send({
                    message: 'course modifier avec success !',
                    course: course
                });

            }).catch(err => {
                res.status(500).send({
                    message: "Error updating course ",
                    error: err
                })
            })


        let oldlist = req.body.oldList;
        for (var i = 0; i < oldlist.length; i++) {
            await articleModel.find({ _id: oldlist[i]._id }).then(async resp => {

                if (resp.length > 0) {
                    const article = await articleModel.findByIdAndUpdate({ _id: oldlist[i]._id }, {
                        quantity: resp[0].quantity - oldlist[i].quantity,

                    }, {
                        new: true
                    })

                    await article.save()
                        .then(async(data) => {


                        }).catch(err => {
                            res.status(500).sebd(err);
                        })
                }

            })
        }

        let newlist = req.body.articleList;
        for (var i = 0; i < newlist.length; i++) {
            await articleModel.find({ _id: newlist[i]._id }).then(async resp => {

                if (resp.length > 0) {
                    const article = await articleModel.findByIdAndUpdate({ _id: newlist[i]._id }, {
                        quantity: resp[0].quantity + newlist[i].quantity,

                    }, {
                        new: true
                    })

                    await article.save()
                        .then(async(data) => {


                        }).catch(err => {
                            res.status(500).sebd(err);
                        })
                }

            })
        }

    } else {

        await courseModel.findById({ _id: id }).then(async course => {

                let TodayDate = new Date(); // today date 
                let database = course.created_at; //date from data base
                let a = moment(TodayDate); // convert date to moment
                let b = moment(database); // convert data to moment
                let diff_minutes = a.diff(b, 'minutes');
                let diff_hours = a.diff(b, 'hours');
                let diff_days = a.diff(b, 'days');

                if (diff_hours < 24) {

                    // time is more than 1 days from now

                    const course = await courseModel.findByIdAndUpdate({ _id: id }, {
                        code: req.body.code,
                        date: req.body.date,
                        articleList: req.body.articleList,
                        types: req.body.types,
                        price: req.body.price,
                        clientID: req.body.clientID

                    }, {
                        new: true
                    })

                    await course.save()
                        .then(async(data) => {

                            if (!data) {
                                res.status(404).send({
                                    message: 'cannot update course'
                                })
                            }
                            res.status(200).send({
                                message: 'course modifier avec success !',
                                course: course
                            });

                        }).catch(err => {
                            res.status(500).send({
                                message: "Error updating course ",
                                error: err
                            })
                        })

                    let oldlist = req.body.oldList;
                    for (var i = 0; i < oldlist.length; i++) {
                        await articleModel.find({ _id: oldlist[i]._id }).then(async resp => {

                            if (resp.length > 0) {
                                const article = await articleModel.findByIdAndUpdate({ _id: oldlist[i]._id }, {
                                    quantity: resp[0].quantity - oldlist[i].quantity,

                                }, {
                                    new: true
                                })

                                await article.save()
                                    .then(async(data) => {


                                    }).catch(err => {
                                        res.status(500).sebd(err);
                                    })
                            }

                        })
                    }

                    let newlist = req.body.articleList;
                    for (var i = 0; i < newlist.length; i++) {
                        await articleModel.find({ _id: newlist[i]._id }).then(async resp => {

                            if (resp.length > 0) {
                                const article = await articleModel.findByIdAndUpdate({ _id: newlist[i]._id }, {
                                    quantity: resp[0].quantity + newlist[i].quantity,

                                }, {
                                    new: true
                                })

                                await article.save()
                                    .then(async(data) => {


                                    }).catch(err => {
                                        res.status(500).sebd(err);
                                    })
                            }

                        })
                    }

                } else if (diff_hours > 24) {
                    // time is less than 1 days from now
                    res.status(400).json({ message: 'Vous ete dépasser 24h' })
                }
            }


        )
    }




}