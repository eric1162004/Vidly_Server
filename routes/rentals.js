const {Rental, validate} = require('../models/rental');
const {Movie} = require('../models/movie');
const {Customer} = require('../models/customer');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Fawn = require('fawn');
const auth = require('../middleware/auth');


Fawn.init(mongoose);

router.get('/', async (req, res)=>{
    const rentals = await Rental.find().sort('-dateOut');
    res.send(rentals)
});

router.get('/:id', async (req, res)=>{
    const rental = await Rental.findById(req.params.id).catch(() => 
        res.status(404).send(`<h2>Rental_Id: ${req.params.id} was not found  :(</h2>`));

    res.send(rental)
});

router.post('/', auth ,async (req, res)=>{
    const {error} = validate(req.body)
    if (error) res.status(400).send(error.details[0].message);

    const customer =  await Customer.findById(req.body.customerId).catch(() =>
    res.status(404).send(`<h2>Customer_Id: ${req.params.id} was not found  :(</h2>`));
    
    const movie =  await Movie.findById(req.body.movieId).catch(() =>
    res.status(404).send(`<h2>Movie_Id: ${req.params.id} was not found  :(</h2>`));

    if(movie.numberInStock === 0) return res.status(400).send('Movie is out of Stock');

    const rental = new Rental({
        customer: {
            _id:customer.id,
            name: customer.name,
            isGold: customer.isGold,
            phone: customer.phone
        },
        movie:{
            _id:movie._id,
            title: movie.title,
            dailyRentalRate:movie.dailyRentalRate
        }
    });
    
    try{
        new Fawn.Task()
           .save('rentals', rental)
           .update('movies', {_id:movie._id},
           { $inc: { numberInStock:-1 }})
           .run();

           res.send(rental);
    }
    catch(ex){
        res.status(500).send('something failed.');
    }

});

router.put('/:id', auth ,async (req, res)=>{
    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const rental = await Rental.findByIdAndUpdate(req.params.id, {$set:req.params.body},
    {new: true}).catch(()=>
    res.status(404).send(`<h2>Rental_Id: ${req.params.id} was not found  :(</h2>`));
    
    res.send(rental);
});

router.delete('/:id', auth ,async (req,res)=>{
    const rental = await Rental.findByIdAndRemove(req.params.id).catch(()=>
    res.status(404).send(`<h2>Rental_Id: ${req.params.id} was not found  :(</h2>`));
    
    res.send(rental);
});

module.exports = router;