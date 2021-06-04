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
    route, resetDB, simplify, isError
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

    this.beforeEach(done => {
        resetDB(done);
    })


    describe("POST", () => {
        it("should create a new Account", done => {
            // 1: Create new Account
            axios.post(route("/account"), utils.mockAccount)
                .then(response => {
                    expect(response.status).to.equal(201);
                    expect(utils.isToken(response.data)).to.be.true;
                    
                    done();
                    // 2: Delete new account?

                })
                .catch(err => done(err));
        })

        it("should throw error on bad request body", done => {
            axios.post(route("/account"), {foo: "baz"})
                .then(response => {
                    expect(response.status).to.equal(400);
                    expect(isError(response.data)).to.be.true;
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
                    expect(isError(response.data)).to.be.true;
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

describe("/c",  function() {
    this.timeout(TIMEOUT);

    this.beforeEach(done => {
        resetDB(done);
    });

    
    const validHeader = {
        headers: {
            Authorization: 'Bearer ' + utils.access_token
        }
    }
    const invalidHeader = {
        headers: {
            Authorization: 'Bearer ' + utils.expired_token
        }
    }

    describe("POST", () => {
        it("should create a new Community", done => {
            axios.post(route('/c'), utils.mockCommunity, validHeader)
                .then(response => {
                    expect(response.status).to.equal(201);
                    expect(simplify(response.data)).to.eql(simplify(utils.mockCommunity));
                    done();
                })
                .catch(err => done(err))
        })

        it("should error on missing access token", done => {
            axios.post(route('/c'), utils.mockCommunity)
                .then(response => {
                    expect(response.status).to.equal(401);
                    expect(isError(response.data)).to.be.true;
                })
                .catch(err => {
                    (err.response && err.response.status==401) ? done() : done(err);
                })
        })

        it("should error on invalid access token", done => {
            axios.post(route('/c'), utils.mockCommunity, invalidHeader)
                .then(response => {
                    expect(response.status).to.equal(403);
                    expect(isError(response.data)).to.be.true;
                })
                .catch(err => {
                    (err.response && err.response.status==403) ? done() : done(err);
                })
        })
        it("should error on missing request body", done => {
            axios.post(route('/c'), null, validHeader)
                .then(response => {
                    expect(response.status).to.equal(400);
                    expect(isError(response.data)).to.be.true;
                    done();
                })
                .catch(err => {
                    (err.response && err.response.status == 400) ? done() : done(err);
                })
        })

        it('should error on invalid request body', done => {
            axios.post(route('/c'), {foo: 'baz'}, validHeader)
                .then(response => {
                    expect(response.status).to.equal(400);
                    expect(isError(response.data)).to.be.true;
                    done();
                })
                .catch(err => {
                    (err.response && err.response.status == 400) ? done() : done(err);    
                })
        })
    })
})

describe("/c/:commId", function () {
    this.timeout(TIMEOUT);

    this.beforeEach(done => {
        resetDB(done);
    });

    describe("GET", () => {
        it("should find Community with specified id", done => {
            const _id = utils.testCommunity._id;
            axios.get(route(`/c/${_id}`))
                .then(response => {
                    expect(response.status).to.equal(200);
                    expect(simplify(response.data)).to.eql(simplify(utils.testCommunity));
                    done()
                })
                .catch(err => done(err));

        })

        it("should error on nonexistent Community" , done => {
            const _id = utils.mockId;
            axios.get(route(`/c/${_id}`))
                .then(response => {
                    expect(response.status).to.equal(404);
                    expect(isError(response.data)).to.be.true;
                    done();
                })
                .catch(err => {
                    if (err.response && err.response.status == 404) {
                        done();
                    } else {
                        done(err);
                    }
                });
        })

        it("should error on invalid ID", done => {
            axios.get(route(`/c/${utils.badId}`))
                .then(response => {
                    expect(response.status).to.equal(404);
                    expect(isError(response.data)).to.be.true;
                    done();
                })
                .catch(err => {
                    (err.response && err.response.status == 404) ? done() : done(err);
                })
        })
    });

})

describe('/c/:commId/feed', function() {
    this.timeout(TIMEOUT);

    this.beforeEach(done => {
        resetDB(done);
    });

    describe("GET", () => {
        it('should return feed of questions for community', done => {
            axios.get(route(`/c/${utils.testCommunity._id}/feed`))
                .then(response => {
                    expect(response.status).to.equal(200);
                    console.log("I NEED TRUE CONTENT CHECKING")
                    done();
                })
                .catch(err => done(err))
        })

        it('should error on nonexistent Community', done => {
            const _id = utils.mockId;
            axios.get(route(`/c/${_id}/feed`))
                .then(response => {
                    expect(response.status).to.equal(404);
                    expect(isError(response.data)).to.be.true;
                    done();
                })
                .catch(err => {
                    if (err.response && err.response.status == 404) {
                        done();
                    } else {
                        done(err);
                    }
                });
        })
    })
})

