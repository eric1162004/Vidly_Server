const Joi = require('joi');
const mongoose = require('mongoose');

const Customer = mongoose.model('Customer', new mongoose.Schema({
    name: {
        type:String,
        required: true,
        minlength: 1,
        maxlength: 20
    },
    isGold: {
        type:Boolean,
        default: false
    },
    phone: {
        type: String,
        required: true, 
        minlength: 9,
        maxlength: 20
    }
}));

function validateCustomer(customer){
    const customerSchema= {
        name: Joi.string().min(1).max(20).required(),
        isGold: Joi.boolean(),
        phone: Joi.string().min(9).max(20).required(),
    };
    return Joi.validate(customer, customerSchema);
}

exports.Customer = Customer;
exports.validate = validateCustomer;
