/**
 * This test file tests the following endpoints
 *      /                       GET
 *      /account                POST, PATCH
 *      /account/login          POST
 *      /account/refresh        POST
 *      /account/feed           GET
 * 
 *      /c                      POST
 *      /c/search               GET
 *      /c/:id                  GET, PATCH
 *      /c/:id/feed             GET
 *      /c/:id/join             POST, DELETE
 *      /c/:id/report           POST
 * 
 *      /c/:id/q                POST
 *      /c/:id/q/:id            GET
 *      /c/:id/q/:id/report     POST
 * 
 *      /c/:id/q/:id/a                  POST
 *      /c/:id/q/:id/a/:id/upvote       POST, DELETE
 *      /c/:id/q/:id/a/:id/downvote     POST, DELETE
 *      /c/:id/q/:id/a/:id/report       REPORT
 */

const data = require("../config/data.json");
const utils = require("./util/testUtil");
const Account = require("../src/schema/Account");
const Community = require("../src/schema/Community");
const Question = require("../src/schema/Question");
const Answer = require("../src/schema/Answer");

const {
    route
} = utils;

const asserttype = require("chai-asserttype");
const axios = require("axios");
const chai = require("chai");

chai.use(asserttype);
const expect = chai.expect;

const TIMEOUT = 10000;

describe("/", function () {
    this.timeout(TIMEOUT);

    describe("GET", () => {
        it("should return React webpage", done => {
            axios.get(route("/"))
                .then(response => {
                    expect(response.status).to.equal(200);
                    done();
                })
                .catch(err => done(err));
        })
    })
})

describe("/account", function () {
    this.timeout(TIMEOUT);

    describe("POST", () => {
        it("should create a new Account", done => {
            // 1: Create new Account
            axios.post(route("/account"), utils.mockAccount)
                .then(response => {
                    expect(response.status).to.equal(201);
                    expect(utils.isValidToken(response.data)).to.be.true;
                    
                    done();
                    // 2: Delete new account?

                })
                .catch(err => done(err));
        })

        it("should throw error on bad request body", done => {
            axios.post(route("/account"), {foo: "baz"})
                .then(response => {
                    expect(response.status).to.equal(400);
                    expect(utils.isValidError(response.body)).to.be.true;
                    done();
                })
                .catch(err => {
                    if (err.response && err.response.status == 400) {
                        done();
                    } else {
                        done(err);
                    }
                });
        });

        it("should throw error when email address already in use", done => {
            axios.post(route("/account"), {email: "admin@test.com", password: "baz"})
                .then(response => {
                    expect(response.status).to.equal(400);
                    expect(utils.isValidError(response.body)).to.be.true;
                    done();
                })
                .catch(err => {
                    if (err.response && err.response.status == 400) {
                        done();
                    } else {
                        done(err);
                    }
                })
        })
    })
})