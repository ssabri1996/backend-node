const menuModel = require('../models/Menu');

// list 
exports.list = async(req, res) => {
    try {
        var menu = await menuModel.find({
            "isPersonalize": false
        });
        res.status(200).json(menu);
    } catch (error) {

        res.status(200).json({ error })
    }
}

// create
exports.create = async(req, res) => {
    if (!req.body) {
        res.status(400).json({ message: 'content can not be empty' })
    }
    var menu = new menuModel(req.body);
    try {
        menu = await menu.save();
        res.status(200).json({
            message: "menu was created successfully",
            menu: menu,
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
        var menu = await menuModel.findById(id);
        res.status(200).json(menu);
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
    menuModel.findByIdAndUpdate(id, req.body).then(async(data) => {
        if (!data) {
            res.status(404).send({
                message: 'cannot update reserveration'
            })
        } else {
            menu = await menuModel.findById(data._id);
            res.status(200).send({
                message: 'menu was updated successfully !',
                menu: menu
            });
        }
    }).catch(err => {
        res.status(500).send({
            message: "Error updating menu ",
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
        var menu = await menuModel.findByIdAndDelete(id);
        res.status(200).json({ message: 'menu deleted' })
    } catch (error) {
        res.status(500).json({ error })

    }
}


// get menu by name
exports.getMenusByNames = async(req, res) => {
    const { name } = req.query;

    await menuModel.findOne({

            "name": name,

        })
        .then(menus => {
            res.status(200).json(menus)
        }).catch(err => {
            res.status(500).send(err)
        })
}


/* get Basic menus by description  */

exports.getMenusByDescription = async(req, res) => {


    try {
        var MenuHauts = await menuModel.find({
            "description": "haut",
            "isPersonalize": false
        });
        var MenuBas = await menuModel.find({
            "description": "bas",
            "isPersonalize": false
        });


        menus = [MenuHauts, MenuBas]

        res.status(200).json(menus);
    } catch (error) {

        res.status(200).json({ error })
    }


}



// get menu by name and description
exports.getMenusByNature = async(req, res) => {
    const { name, saison } = req.query;

    await menuModel.find({

            name: name,
            description: saison

        })
        .then(menus => {
            res.status(200).json(menus)
        }).catch(err => {
            res.status(500).send(err)
        })
}