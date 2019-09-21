const Joi = require('joi');
const config = require('config');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const userSchema =new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 50
    },
    email:{
        type: String,
        required: true,
        unique: true,
        minlength: 5,
        maxlength: 255
    }, 
    password:{
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024
    }, 
    isAdmin:Boolean 
}) 

userSchema.methods.generateAuthToken= function(){
    const token = jwt.sign({_id: this._id, isAdmin: this.isAdmin}, config.get('jwtPrivateKey'));
    return token;
}

let User = mongoose.model('User', userSchema);

// try {
//     User = mongoose.model('user', userSchema);
// }catch(err){
//     User = User();
// }

function validateUser(User){
    const Schema = {
        name: Joi.string().required().min(1).max(50),
        email: Joi.string().required().min(5).max(255).email(),
        password: Joi.string().required().min(5).max(255)
    };
    return Joi.validate(User, Schema);
}

exports.User = User;
exports.validate = validateUser; 

