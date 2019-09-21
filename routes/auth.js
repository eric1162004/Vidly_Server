const {User} = require('../models/user');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Joi = require('joi');

router.post('/', async (req, res)=>{
    const {error} = validate(req.body)
    if (error) res.status(400).send(error.details[0].message);

    let user = await User.findOne({email : req.body.email});
    if(!user) return res.status(400).send('Invalid email or password');

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword) return res.status(400).send('Invalid email or password');

    const token = user.generateAuthToken();
    res.send(token);
});

function validate(req){
    const Schema = {
        email: Joi.string().required().min(5).max(255).email(),
        password: Joi.string().required().min(5).max(255)
    };
    return Joi.validate(req, Schema);
}



module.exports = router;