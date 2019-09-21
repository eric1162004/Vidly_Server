const winston = require('winston');
const mongoose = require('mongoose');
const config = require('config');

module.exports = function(){
    const db = config.get('db');
    mongoose.connect(db)
    .then(()=>{
        winston.info(`Connected to ${db}...`);
        console.log(`Connected to ${db}...`);
        console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
    });
}
