const userModel = require('../models/User');
const bcrypt = require("bcrypt");

// list
exports.list = async(req, res) => {
    try {
        var users = await userModel.find({...req.query });
        res.status(200).json(users);
    } catch (error) {

        res.status(200).json({ error });
    }
};


// retrieve
exports.retrieve = async(req, res) => {
    var { id } = req.params;
    if (!id) {
        res.status(400).json({ message: 'id can not be empty' })
    }
    try {
        var user = await userModel.findById(id);
        res.status(200).json(user);
    } catch (error) {

        res.status(200).json({ error })
    }
}

exports.create = async(req, res) => {
    if (!req.body) {
        res.status(400).json({ message: 'content can not be empty' })
    }
    const salt = await bcrypt.genSalt(10);
    var user = new userModel(req.body);
    user.password = await bcrypt.hash(user.password, salt);
    try {
        var savedUser = await user.save();
        res.status(200).json({ savedUser: savedUser, message: "user was created successfully" })
    } catch (error) {
        res.status(500).json({ error })
    }
}

// retrieve
exports.profile = async(req, res) => {
    var { id } = req.params;
    if (!id) {
        res.status(400).json({ message: 'id can not be empty' })
    }
    try {
        var user = await userModel.findById(id);
        res.status(200).json(user);
    } catch (error) {

        res.status(200).json({ error })
    }
}


//get list of active users 

exports.getListActiveUsers = async(req, res) => {

    await userModel.find({
        isActive: true
    }).then(user => {
        res.status(200).send(user)
    }).catch(err => {
        res.status(500).send(err)
    })
}

/* reset Password */
module.exports.resetPassword = async(req, res) => {

    const { newPass, userID } = req.body;

    const us = await userModel.findByIdAndUpdate({ _id: userID }, {
        password: newPass
    }, { new: true });

    const salt = await bcrypt.genSalt(10);
    us.password = await bcrypt.hash(us.password, salt)

    us.save().then(response => {
        res.status(201).json({
            message: "Your password has been changed",
            resp: response
        });
    }).catch(err => {
        res.status(400).json({ error: "reset password error" });
    })




}