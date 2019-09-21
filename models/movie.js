const Joi = require('joi');
const mongoose = require('mongoose');
const {genreSchema} = require('./genre');

const Movie = mongoose.model('Movie', new mongoose.Schema({
    title: {
        type:String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 255
    },
    genre: {
        type: genreSchema,
        required: true
    },
    numberInStock:{
        type:Number,
        required: true,
        min: 0,
        max: 255
    },
    dailyRentalRate:{
        type:Number,
        required: true,
        min: 0,
        max:255
    }
}));

function validateMovie(movie){
    const movieSchema= {
        title: Joi.objectId().min(3).max(255).required(),
        genreId: Joi.objectId().required(),
        numberInStock: Joi.number().min(0).required(),
        dailyRentalRate: Joi.number().min(0).required()
    };
    return Joi.validate(movie, movieSchema);
}

exports.Movie = Movie;
exports.validate = validateMovie;