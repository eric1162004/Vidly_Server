const {Customer, validate} = require('../models/customer');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');



router.get('/', async (req, res)=>{
    const customers = await Customer
    .find()
    .sort('name')
    .select('name isGold phone');
    res.send(customers)
});

router.get('/:id', async (req, res)=>{
    const customer = await Customer.findById(req.params.id).catch(() => 
        res.status(404).send(`<h2>Customer_Id: ${req.params.id} was not found  :(</h2>`));

    res.send(customer)
});

router.post('/', auth ,async (req, res)=>{
    const {error} = validate(req.body)
    if (error) res.status(400).send(error.details[0].message);

    const customer = new Customer({
        name: req.body.name, 
        isGold: req.body.isGold,
        phone: req.body.phone
    });
    const result = await customer.save();

    res.send(result);
});

router.put('/:id', auth , async (req, res)=>{
    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const customer = await Customer.findById(req.params.id)
    .catch(()=>res.status(404).send(`<h2>Customer_Id: ${req.params.id} was not found  :(</h2>`));
    
    customer.set(req.body);
    
    res.send(customer);
});

router.delete('/:id',auth , async (req,res)=>{
    const customer = await Customer.findByIdAndRemove(req.params.id).catch(()=>
    res.status(404).send(`<h2>Customer_Id: ${req.params.id} was not found  :(</h2>`));
    
    res.send(customer);
});

module.exports = router;