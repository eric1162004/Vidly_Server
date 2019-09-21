const Joi = require('joi');
const mongoose = require('mongoose');

const genreSchema = new mongoose.Schema({
    name: {
        type:String,
        required: true,
        minlength: 3,
        maxlength: 20
    }
});

const Genre = mongoose.model('Genre', genreSchema);

function validateGenre(genre){
    const genreSchema= {
        name: Joi.string().min(3).max(20).required()
    };
    return Joi.validate(genre, genreSchema);
}

exports.Genre = Genre;
exports.validate = validateGenre;
exports.genreSchema = genreSchema;