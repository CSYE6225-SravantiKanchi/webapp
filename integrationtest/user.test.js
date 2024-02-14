require('dotenv').config();
const request = require("supertest");
const app = require("../config/express");
const httpStatus = require('http-status');
const { sequelize } = require('../models'); 

describe("User Tests", () => {

    beforeAll(async () => {
        await sequelize.sync({ alter: true });
    });

    it("should create an account and validate its existence", async () => {
        const payload = {
                first_name: "Random",
                last_name: "RandomLast",
                password: "test",
                username: "randomLast@example.com"
        };
    
        const createRes = await request(app)
                .post("/v1/user")
                .send(payload)
    
        expect(createRes.statusCode).toBe(httpStatus.CREATED);
    
        const getRes = await request(app)
                .get("/v1/user/self")
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
                .put("/v1/user/self")
                .send(payload)
                .set('Authorization', 'Basic ' + Buffer.from('randomLast@example.com:test').toString('base64'));
    
            expect(updateRes.statusCode).toBe(httpStatus.NO_CONTENT);
    
            const getRes = await request(app)
                .get("/v1/user/self")
                .set('Authorization', 'Basic ' + Buffer.from('randomLast@example.com:test').toString('base64'));
    
            expect(getRes.statusCode).toBe(httpStatus.OK);
            expect(getRes.body.first_name).toBe(payload.first_name);
        });
    
    afterAll(async () => {

        await sequelize.close();
    });
});