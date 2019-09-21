const {Genre, validate} = require('../models/genre');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const validateObjectId = require('../middleware/validateObjectID');

router.get('/', async (req, res)=>{
    const genres = await Genre.find().sort('name');
    res.send(genres);
});

router.get('/:id', validateObjectId, async (req, res)=>{
    const genre = await Genre.findById(req.params.id);
   
    if (!genre) return res.status(404).send(`<h2>Genre_Id: ${req.params.id} was not found  :(</h2>`);

    res.send(genre);
});

router.post('/', auth ,async (req, res)=>{

    const {error} = validate(req.body)
    if (error) res.status(400).send(error.details[0].message);

    const genre = new Genre({name: req.body.name});
    const result = await genre.save();

    res.send(result);
});

router.put('/:id', auth ,async (req, res)=>{
    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findByIdAndUpdate(req.params.id, {name: req.body.name}, {new: true}).catch(()=>
    res.status(404).send(`<h2>Genre_Id: ${req.params.id} was not found  :(</h2>`));
    
    res.send(genre);
});

router.delete('/:id',[auth, admin] , async (req,res)=>{
    const genre = await Genre.findByIdAndRemove(req.params.id).catch(()=>
    res.status(404).send(`<h2>Genre_Id: ${req.params.id} was not found  :(</h2>`));
    
    res.send(genre);
});

module.exports = router;