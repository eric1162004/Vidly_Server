const {User} = require('../../../models/User');
const jwt = require('jsonwebtoken');
const config = require('config');
const mongoose = require('mongoose');


describe('user.generateAuthToken', ()=>{
    it('should return an token when a user is saved to the db', ()=>{
        const payload = {
            _id:new mongoose.Types.ObjectId().toHexString(), 
            isAdmin:true
        };
        const user = new User(payload);
        
        const token = user.generateAuthToken();

        const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
        expect(decoded).toMatchObject(payload);
    });
});