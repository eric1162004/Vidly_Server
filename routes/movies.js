const {Movie, validate} = require('../models/movie');
const {Genre} = require('../models/genre');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const auth = require('../middleware/auth');


router.get('/', async (req, res)=>{
    const movies = await Movie.find().sort('name');
    res.send(movies)
});

router.get('/:id', async (req, res)=>{
    const movie = await Movie.findById(req.params.id).catch(() => 
        res.status(404).send(`<h2>Movie_Id: ${req.params.id} was not found  :(</h2>`));

    res.send(movie)
});

router.post('/',auth , async (req, res)=>{
    const {error} = validate(req.body)
    if (error) res.status(400).send(error.details[0].message);

    const genre =  await Genre.findById(req.body.genreId).catch(() =>
    res.status(404).send(`<h2>Genre_Id: ${req.params.id} was not found  :(</h2>`));

    const movie = new Movie({
        title: req.body.title,
        genre: {
            _id: genre._id,
            name: genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate,
    });
    await movie.save();

    res.send(movie);
});

router.put('/:id',auth , async (req, res)=>{
    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const movie = await Movie.findByIdAndUpdate(req.params.id, {$set:req.body}, {new: true}).catch(()=>
    res.status(404).send(`<h2>Movie_Id: ${req.params.id} was not found  :(</h2>`));
    
    res.send(movie);
});

router.delete('/:id',auth , async (req,res)=>{
    const movie = await Movie.findByIdAndRemove(req.params.id).catch(()=>
    res.status(404).send(`<h2>Movie_Id: ${req.params.id} was not found  :(</h2>`));
    
    res.send(movie);
});

module.exports = router;