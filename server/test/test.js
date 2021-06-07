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
const { isToken } = require("./util/testUtil");

chai.use(asserttype);
const expect = chai.expect;

const TIMEOUT = 10000;

const validHeader = {
    headers: {
        Authorization: 'Bearer ' + utils.access_token
    }
}
const invalidHeader = {
    headers: {
        Authorization: 'Bearer ' + utils.expired_access
    }
}

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

describe("/account/refresh", function () {
    this.timeout(TIMEOUT);

    this.beforeEach(done => {
        resetDB(done);
    });

    describe("POST", () => {
        it("should update access tokens", done => {
            axios.post(route('/account/refresh'), utils.mockRefresh, invalidHeader)
                .then(response => {
                    expect(response.status).to.equal(200);
                    expect(utils.isToken(response.data)).to.be.true;
                    done()
                })
                .catch(err => done(err))
        })

        it("should fail for invalid refresh token", done => {
            axios.post(route('/account/refresh'), {refresh_token: utils.expired_refresh})
                .then(response => {
                    expect(response.status).to.equal(403);
                    expect(isError(response.data)).to.be.true;
                    done();
                })
                .catch(err => {
                    (err.response && err.response.status==403) ? done() : done(err);
                })
        })
    })

})

describe("/account/feed", function () {
    this.timeout(TIMEOUT);

    this.beforeEach(done => {
        resetDB(done);
    });

    describe("GET", () => {
        it('should retreive list of communities', done => {
            axios.get(route('/account/feed'), validHeader)
                .then(response => {
                    expect(response.status).to.equal(200);
                    expect(response.data.length).to.equal(0);
                    done();
                })
                .catch(err => done(err))
        })

        it('should error on invalid authentication', done => {
            axios.get(route('/account/feed'), invalidHeader)
                .then(response => {
                    expect(response.status).to.equal(403);
                    expect(isError(response.data)).to.be.true;
                    done();
                })
                .catch(err => {
                    (err.response && err.response.status==403) ? done() : done(err);
                })
        })
    })
})

describe("/c",  function() {
    this.timeout(TIMEOUT);

    this.beforeEach(done => {
        resetDB(done);
    });

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

        it('should handle extra request body parameters', done => {
            const extraBody = {}
            Object.keys(utils.mockCommunity).forEach(prop => extraBody[prop]=utils.mockCommunity[prop]);
            extraBody.foo = "baz"
            axios.post(route('/c'), extraBody, validHeader)
                .then(response => {
                    expect(response.status).to.equal(201);
                    expect(simplify(response.data)).to.eql(simplify(utils.mockCommunity));
                    expect(Object.keys(response.data)).to.not.include('foo');
                    done();
                })
                .catch(err => done(err))
        })
    })
})

describe("/c/search", function () {
    this.timeout(TIMEOUT);

    this.beforeEach(done => {
        resetDB(done);
    });

    describe("GET", () => {
        it('should return search results', done => {
            axios.get(route('/c/search?terms=Test+Community'))
                .then(response => {
                    expect(response.status).to.equal(200);
                    expect(response.data.length).to.equal(1);
                    done();
                })
                .catch(err => err);
        })

        it("should error on missing query terms", done => {
            axios.get(route('/c/search?terms='))
                .then(response => {
                    expect(response.status).to.equal(400);
                    expect(isError(response.data)).to.be.true;
                    done();
                })
                .catch(err => {
                    (err.response && err.response.status==400) ? done() : done(err);
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
                    expect(response.data.num_returned).to.equal(data.questions.filter(elem => elem['community']==utils.testCommunity._id).length);
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

describe('/c/:commId/join', function() {
    this.timeout(TIMEOUT);

    this.beforeEach(done => {
        resetDB(done);
    })

    describe("POST", () => {
        it("should add Community to user's list", done => {
            axios.post(route(`/c/${utils.testCommunity._id}/join`), null, validHeader)
                .then(response => {
                    expect(response.status).to.equal(204);

                    Account.findById(utils.testAccount._id)
                        .then(data => {
                            expect(data.communities).to.include(utils.testCommunity._id);
                            done();
                        })
                        .catch(err => done(err));

                })
                .catch(err => done(err));
        })

        it('should not add duplicates to Community list', done => {
            axios.post(route(`/c/${utils.testCommunity._id}/join`), null, validHeader)
                .then(response => {
                    expect(response.status).to.equal(204);

                    Account.findById(utils.testAccount._id)
                        .then(data => {
                            expect(data.communities).to.include(utils.testCommunity._id);
                            const prevLength = data.communities.length;

                            axios.post(route(`/c/${utils.testCommunity._id}/join`), null, validHeader)
                                .then(response => {
                                    expect(response.status).to.equal(204);

                                    Account.findById(utils.testAccount._id)
                                        .then(data => {
                                            expect(data.communities).to.include(utils.testCommunity._id);
                                            expect(data.communities.length).to.equal(prevLength);
                                            done();
                                        })
                                        .catch(err => done(err))
                                })
                                .catch(err => done(err))
                        })
                        .catch(err => done(err))
                })
                .catch(err => done(err))
            })
    })

    describe("DELETE", () => {
        it("should remove Community from user's list", done => {
            axios.post(route(`/c/${utils.testCommunity._id}/join`), null, validHeader)
                .then(response => {
                    expect(response.status).to.equal(204);

                    Account.findById(utils.testAccount._id)
                        .then(data => {
                            expect(data.communities).to.include(utils.testCommunity._id);
                            const prevLength = data.communities.length;

                            axios.delete(route(`/c/${utils.testCommunity._id}/join`), validHeader)
                                .then(response => {
                                    expect(response.status).to.equal(204);

                                    Account.findById(utils.testAccount._id)
                                        .then(data => {
                                            expect(data.communities).to.not.include(utils.testCommunity._id);
                                            expect(data.communities.length).to.not.equal(prevLength);

                                            done();
                                        })
                                        .catch(err => done(err))
                                })
                                .catch(err => done(err))

                        })
                        .catch(err => done(err));

                })
                .catch(err => done(err));
        })
        it("should not throw error if Community already removed from list", done => {
            Account.findById(utils.testAccount._id)
                .then(data => {
                    expect(data.communities).to.not.include(utils.testCommunity._id);
                    const prevLength = data.communities.length;

                    axios.delete(route(`/c/${utils.testCommunity._id}/join`), validHeader)
                        .then(response => {
                            expect(response.status).to.equal(204);
                            
                            Account.findById(utils.testAccount._id)
                                .then(data => {
                                    expect(data.communities).to.not.include(utils.testCommunity._id);
                                    expect(data.communities.length).to.equal(prevLength);
                                    done();
                                })
                                .catch(err => done(err))
                        })
                        .catch(err => done(err))
                })
                .catch(err => done(err))
        })
    })
})

describe('/c/:commId/q', function() {
    this.timeout(TIMEOUT);

    this.beforeEach(done => {
        resetDB(done);
    })

    describe("POST", () => {
        it("should create a new question", done => {
            let expected = JSON.parse(JSON.stringify(utils.mockQuestion));
            expected.answers = [];
            expected.community = utils.testCommunity._id;

            axios.post(route(`/c/${utils.testCommunity._id}/q`), utils.mockQuestion, validHeader)
                .then(response => {
                    expect(response.status).to.equal(201);
                    expect(simplify(response.data)).to.eql(simplify(expected));
                    done();
                })
                .catch(err => done(err))
        })
        it("should error on invalid request body", done => {
            axios.post(route(`/c/${utils.testCommunity._id}/q`), {foo: "baz"}, validHeader)
                .then(response => {
                    expect(response.status).to.equal(400);
                    expect(isError(response.data));
                    done();
                })
                .catch(err => {
                    (err.response && err.response.status==400) ? done() : done(err);
                })
        })
    })
})

describe('/c/:commId/q/:quesId', function() {
    this.timeout(TIMEOUT);

    this.beforeEach(done => {
        resetDB(done);
    })

    describe("GET", () => {
        it("should return question information", done => {
            const expected = JSON.parse(JSON.stringify(utils.testQuestion));
            delete expected.author;

            axios.get(route(`/c/${utils.testCommunity._id}/q/${utils.testQuestion._id}`))
                .then(response => {
                    expect(response.status).to.equal(200);
                    expect(simplify(response.data)).to.eql(simplify(expected));
                    done();
                })
                .catch(err => done(err))
        })

        it("should error on nonexistent question", done => {
            axios.get(route(`/c/${utils.testCommunity._id}/q/${utils.mockId}`))
                .then(response => {
                    expect(response.status).to.equal(404);
                    expect(isError(response.data)).to.be.true;
                    done()
                })
                .catch(err => {
                    (err.response && err.response.status == 404) ? done() : done(err);
                })
        })
    })
})


describe('/c/:commId/q/:quesId/a', function() {
    this.timeout(TIMEOUT);

    this.beforeEach(done => {
        resetDB(done);
    })

    describe("POST", () => {
        it("should create a new answer", done => {
            axios.post(route(`/c/${utils.testCommunity._id}/q/${utils.testQuestion._id}/a`), utils.mockAnswer, validHeader)
                .then(response => {
                    expect(response.status).to.equal(204);
                    done()
                })
                .catch(err => done(err))
        })

        it("should error on missing body", done => {
            axios.post(route(`/c/${utils.testCommunity._id}/q/${utils.testQuestion._id}/a`), null, validHeader)
                .then(response => {
                    expect(response.status).to.equal(400);
                    expect(isError(response.data)).to.be.true;
                    done();
                })
                .catch(err => {
                    (err.response && err.response.status==400) ? done() : done(err);
                })
        })

        it("should error on invalid body", done => {
            axios.post(route(`/c/${utils.testCommunity._id}/q/${utils.testQuestion._id}/a`), {foo: "baz"}, validHeader)
                .then(response => {
                    expect(response.status).to.equal(400);
                    expect(isError(response.data)).to.be.true;
                    done();
                })
                .catch(err => {
                    (err.response && err.response.status==400) ? done() : done(err);
                })
        })
    })
})

const answerEndpointBase = `/c/${utils.testCommunity._id}/q/${utils.testQuestion._id}/a/${utils.testAnswer._id}`;

describe('/c/:commId/q/:quesId/a/:answId/upvote', function () {
    this.timeout(TIMEOUT);

    this.beforeEach(done => {
        resetDB(done);
    });

    describe("POST", () => {
        it("should increase answer score", done => {
            // 1. Check initial score
            Answer.findById(utils.testAnswer._id)
                .then(data => {
                    const initialScore = data.score;

                    // 2. Upvote
                    axios.post(route(answerEndpointBase+"/upvote"), null, validHeader)
                        .then(response => {
                            expect(response.status).to.equal(204);

                            // 3. Check new score
                            Answer.findById(utils.testAnswer._id)
                                .then(data => {
                                    expect(data.score).to.equal(initialScore+1);
                                    done();
                                })
                                .catch(err => done(err))


                        })
                        .catch(err => done(err))
                })
                .catch(err => done(err))
            
        })
        it("should add question to user upvotes", done => {
            // 1. Check initial upvotes
            Account.findById(utils.testAccount._id)
                .then(data => {
                    const initialUpvotes = data.upvotes;
                    expect(initialUpvotes).to.not.include(utils.testAnswer._id);

                    // 2. Upvote
                    axios.post(route(answerEndpointBase+'/upvote'), null, validHeader)
                        .then(response => {
                            expect(response.status).to.equal(204);

                            // 3. Check included in upvotes
                            Account.findById(utils.testAccount._id)
                                .then(data => {
                                    expect(data.upvotes).to.include(utils.testAnswer._id);
                                    done();
                                })
                                .catch(err => done(err))

                        })
                        .catch(err => done(err))

                })
                .catch(err => done(err))
        })
        it("should not change score for duplicate upvotes by single user", done => {
            // 1. Upvote
            axios.post(route(answerEndpointBase+'/upvote'), null, validHeader)
                .then(response => {
                    expect(response.status).to.equal(204);

                    // 2. Get initial score
                    Answer.findById(utils.testAnswer._id)
                        .then(data => {
                            const initialScore = data.score;

                            // 3. Make duplicate upvote
                            axios.post(route(answerEndpointBase+'/upvote'), null, validHeader)
                                .then(response => {
                                    expect(response.status).to.equal(204);

                                    // 4. Check new score
                                    Answer.findById(utils.testAnswer._id)
                                        .then(data => {
                                            expect(data.score).to.equal(initialScore);
                                            done();
                                        })
                                        .catch(err => done(err))

                                })
                                .catch(err => done(err))

                        })
                        .catch(err => done(err))
                })
                .catch(err => done(err))
        })
        it("should not create duplicate upvotes entires for single user", done => {
            // 1. Upvote
            axios.post(route(answerEndpointBase+'/upvote'), null, validHeader)
                .then(response => {
                    expect(response.status).to.equal(204);

                    // 2. Get initial upvotes
                    Account.findById(utils.testAccount._id)
                        .then(data => {
                            const initialUpvotes = data.upvotes
                            expect(initialUpvotes).to.include(utils.testAnswer._id);

                            // 3. Make extra upvote
                            axios.post(route(answerEndpointBase+'/upvote'), null, validHeader)
                                .then(response => {
                                    expect(response.status).to.equal(204);

                                    // 4. Check new upvotes
                                    Account.findById(utils.testAccount._id)
                                        .then(data => {
                                            expect(data.upvotes.length).to.equal(initialUpvotes.length);
                                            done();
                                        })
                                        .catch(err => done(err))

                                })
                                .catch(err => done(err))

                        })
                        .catch(err => done(err))

                })
                .catch(err => done(err))
        })
        it("should error on nonexistent answer", done => {
            axios.post(route(`/c/${utils.testCommunity._id}/q/${utils.testQuestion._id}/a/${utils.mockId}/upvote`), null, validHeader)
                .then(response => {
                    expect(response.status).to.be(404);
                    expect(isError(response.data)).to.be.true;
                    done();
                })
                .catch(err => {
                    (err.response && err.response.status==404) ? done() : done(err);
                })
        })
    })
    describe("DELETE", () => {
        it("should decrease answer score if already upvoted", done => {
            // 1. Upvote
            axios.post(route(answerEndpointBase+'/upvote'), null, validHeader)
                .then(response => {
                    expect(response.status).to.equal(204);

                    // 2. Get initial score
                    Answer.findById(utils.testAnswer._id)
                        .then(data => {
                            const initialScore = data.score;
                            console.log(initialScore);

                            // 3. Delete upvote
                            axios.delete(route(answerEndpointBase+'/upvote'), validHeader)
                                .then(response => {
                                    expect(response.status).to.equal(204);

                                    // 4. Check new score
                                    Answer.findById(utils.testAnswer._id)
                                        .then(data => {
                                            expect(data.score).to.equal(initialScore-1);
                                            done();
                                        })
                                        .catch(err => done(err))

                                })
                                .catch(err => done(err))

                        })
                        .catch(err => done(err))
                    
                })
                .catch(err => done(err))
        })

        it("should remove answer from user upvotes if already upvoted", done => {
            // 1. Upvote
            axios.post(route(answerEndpointBase+'/upvote'), null, validHeader)
                .then(response => {
                    expect(response.status).to.equal(204);

                    // 2. Check initial upvotes
                    Account.findById(utils.testAccount._id)
                        .then(data => {
                            expect(data.upvotes).to.include(utils.testAnswer._id);

                            // 3. Delete upvote
                            axios.delete(route(answerEndpointBase+'/upvote'), validHeader)
                                .then(response => {
                                    expect(response.status).to.equal(204);

                                    // 4. Check new upvotes
                                    Account.findById(utils.testAccount._id)
                                        .then(data => {
                                            expect(data.upvotes).to.not.include(utils.testAnswer._id);
                                            done();
                                        })
                                        .catch(err => done(err))

                                })
                                .catch(err => done(err))

                        })
                        .catch(err => done(err))

                })
                .catch(err => done(err))
        })
        //it("should not change score if not upvoted")
    })
})

describe('/c/:commId/report', function() {
    this.timeout(TIMEOUT);

    this.beforeEach(done => {
        resetDB(done);
    })

    describe("POST", () => {
        it("should create report in records", done => {
            axios.post(route(`/c/${utils.testCommunity._id}/report`), utils.mockReport, validHeader)
                .then(response => {
                    expect(response.status).to.equal(204);
                    done();
                })
                .catch(err => done(err))
        })
    })
})
describe('/c/:commId/q/:quesId/report', function() {
    this.timeout(TIMEOUT);

    this.beforeEach(done => {
        resetDB(done);
    })

    describe("POST", () => {
        it("should create report in records", done => {
            axios.post(route(`/c/${utils.testCommunity._id}/q/${utils.testQuestion._id}/report`), utils.mockReport, validHeader)
                .then(response => {
                    expect(response.status).to.equal(204);
                    done();
                })
                .catch(err => done(err))
        })
    })
})
describe('/c/:commId/q/:quesId/a/:answId/report', function() {
    this.timeout(TIMEOUT);

    this.beforeEach(done => {
        resetDB(done);
    })

    describe("POST", () => {
        it("should create report in records", done => {
            axios.post(route(`/c/${utils.testCommunity._id}/q/${utils.testQuestion._id}/a/${utils.testAnswer._id}/report`), utils.mockReport, validHeader)
                .then(response => {
                    expect(response.status).to.equal(204);
                    done();
                })
                .catch(err => done(err))
        })
    })
})