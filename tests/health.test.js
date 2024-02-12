/**
 * https://jestjs.io/docs/mock-functions
*/

jest.mock('../config/sequelize', () => {
  const Sequelize = require("sequelize-mock");

  const sequelizeMock = new Sequelize(); 
  sequelizeMock.authenticate = jest.fn();
  
  return { sequelize: sequelizeMock };
});


jest.mock('../models/user.model', (

) => () => {
  const Sequelize = require("sequelize-mock");

  const dbMock = new Sequelize();
  return dbMock.define('user',  {
    id: '10a8337b-d8f2-42b4-9b0d-55d57f5545a9',
    first_name: 'random',
    last_name: 'user',
    password: "random",
    username: 'dummy'
  })
});

const request = require("supertest");
const app = require("../config/express");
const { sequelize } = require("../config/sequelize");
const httpStatus = require('http-status');


describe("GET /healthz", () => {

  beforeEach(() => {
    sequelize.authenticate.mockImplementation(() => {});      
  });

  it("should return 405 not allowed for other methods", async () => {
    const resPut = await request(app).put("/healthz");
    expect(resPut.statusCode).toBe(httpStatus.METHOD_NOT_ALLOWED);

    const resPost = await request(app).post("/healthz");
    expect(resPost.statusCode).toBe(httpStatus.METHOD_NOT_ALLOWED);

    const resPatch = await request(app).patch("/healthz");
    expect(resPatch.statusCode).toBe(httpStatus.METHOD_NOT_ALLOWED);

    const resDelete = await request(app).delete("/healthz");
    expect(resDelete.statusCode).toBe(httpStatus.METHOD_NOT_ALLOWED);

  });

  it("should return 503 Status when Sequelize connection fails", async () => {
    sequelize.authenticate.mockImplementation(() => { throw new Error('This is an error'); });
    const res = await request(app).get("/healthz");
    expect(res.statusCode).toBe(httpStatus.SERVICE_UNAVAILABLE);
  });

  it("should return 200 Status OK", async () => {
      const res = await request(app).get("/healthz").send();
      expect(res.headers['cache-control']).toBe('no-cache, no-store, must-revalidate');
      expect(res.statusCode).toBe(httpStatus.OK);
  });
  

  it("should return 400 bad request when payload is passed", async () => {

    const resQuery = await request(app).get("/healthz?x=ala");

    expect(resQuery.statusCode).toBe(httpStatus.BAD_REQUEST);

    const resBody = await request(app).get("/healthz").send({
      'id': 1,
      'name': 'Mike'
    });
    expect(resBody.statusCode).toBe(httpStatus.BAD_REQUEST);

});
});
