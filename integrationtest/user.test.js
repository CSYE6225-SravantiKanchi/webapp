require('dotenv').config();
const request = require("supertest");
const app = require("../config/express");
const httpStatus = require('http-status');
const moment = require('moment');
 
const { sequelize, MailTracking } = require('../models'); 

describe("User Tests", () => {

    beforeAll(async () => {
        await sequelize.sync({ force: true });
    });

    it("should create an account and validate its existence", async () => {
        const payload = {
                first_name: "Random",
                last_name: "RandomLast",
                password: "test",
                username: "randomLast@example.com"
        };
    
        const createRes = await request(app)
                .post("/v2/user")
                .send(payload)
    
        expect(createRes.statusCode).toBe(httpStatus.CREATED);
        // assuming that mail has been sent
        await MailTracking.create({email: payload.username, mail_sent: new moment()});

        await request(app)
                .get(`/v2/user/randomLast@example.com/${createRes.body.verification_token}/verification`)
                .set('Authorization', 'Basic ' + Buffer.from('randomLast@example.com:test').toString('base64'));        
        const getRes = await request(app)
                .get("/v2/user/self")
                .set('Authorization', 'Basic ' + Buffer.from('randomLast@example.com:test').toString('base64'));
    
        expect(getRes.statusCode).toBe(httpStatus.OK);
        expect(getRes.body.first_name).toBe(payload.first_name);
        expect(getRes.body.last_name).toBe(payload.last_name);
        expect(getRes.body.username).toBe(payload.username);
        });
    
        it("should update the account and validate the update", async () => {
            const payload = {
                first_name: "UpdatedFirstName"
            };
    
            const updateRes = await request(app)
                .put("/v2/user/self")
                .send(payload)
                .set('Authorization', 'Basic ' + Buffer.from('randomLast@example.com:test').toString('base64'));
    
            expect(updateRes.statusCode).toBe(httpStatus.NO_CONTENT);
    
            const getRes = await request(app)
                .get("/v2/user/self")
                .set('Authorization', 'Basic ' + Buffer.from('randomLast@example.com:test').toString('base64'));
    
            expect(getRes.statusCode).toBe(httpStatus.OK);
            expect(getRes.body.first_name).toBe(payload.first_name);
        });
    
    afterAll(async () => {

        await sequelize.close();
    });
});