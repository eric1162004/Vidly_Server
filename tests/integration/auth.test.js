const {User} = require('../../models/user');
const {Genre} = require('../../models/genre');
const request = require('supertest');

let server; 

describe('auth middleware', ()=>{
    beforeEach( ()=>{
        server =  require('../../index'); 
    });

    afterEach( async ()=>{
        await Genre.deleteMany();
        await server.close();   
    });

    let token;

    const exec = ()=>{
        return request(server)
        .post('/api/genres') 
        .set('x-auth-token', token)
        .send({name:'genre1'});
    };

    beforeEach(()=>{
        token = new User().generateAuthToken();
    });

    it('should return 401 if no token is provided',  async()=>{
        token = '';

        const res = await exec();

        expect(res.status).toBe(401);
    }); 
    
    it('should return 400 if an invalid token is provided',  async()=>{
        token = '1';

        const res = await exec();

        expect(res.status).toBe(400);
    });

    it('should return 200 if a valid token is provided',  async()=>{
        const res = await exec();

        expect(res.status).toBe(200);
    }); 
}); 