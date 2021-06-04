"use strict";

require("dotenv").config()
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const utils = require("./routesUtil");
const Account = require("./schema/Account");
const Community = require("./schema/Community");
const Question = require("./schema/Question");
const Answer = require("./schema/Answer");
const Report = require("./schema/Report");

const {
    authenticateToken, errorBody, error500, handleReport, handleVote,
    existsCommunity, existsQuestion, existsAnswer, 
    validCommunity, validQuestion, validAnswer, validReport
} = utils;

const notImplemented = {
    message: "This endpoint is planned but has not yet been implemented"
}

/**
 * Base Webpage Endpoints
 *      /   GET
 */
router.route("/")
    .get((req, res) => {
        console.log("GET /");
        res.status(200).send({
            data: "App is running."
        });
    });


/**
 * Account Endpoints
 *      /account            POST, PATCH
 *      /account/login      POST
 *      /account/refresh    POST
 *      /account/feed       GET
 */
router.route("/account")
    .post((req, res) => {
        console.log("POST /account");
        
        const [valid, body] = utils.validAccountLogin(req.body);

        if (!valid) {
            res.status(400).send(body);
            return;
        }


        Account.exists({email: body['email']}, (err, doc) => {
            if (err) {
                console.log(err);
                res.status(500).send(error500);
                return;
            } else {
                if (doc) {
                    // Email already in use
                    res.status(400).send(errorBody(`Email address ${body['email']} is already in use`));
                    return;
                }

                // Create account
                body['communities'] = [];
                body['upvotes'] = [];
                body['downvotes'] = [];

                Account.create(body).save()
                    .then(data => {
                        // Generate JWT
                        const access_token = jwt.sign(
                            { _id: data['_id'], iat: Math.floor(Date.now() / 1000)},
                            process.env.ACCESS_TOKEN_SECRET,
                            {expiresIn: '6h'}
                        );
                        const refresh_token = jwt.sign(
                            { email: body['email'], password: body['password'], iat: Math.floor(Date.now() /1000)},
                            process.env.REFRESH_TOKEN_SECRET,
                            {expiresIn: '14d'}
                        );

                        res.status(201).send(utils.packageTokens(access_token, refresh_token));
                        return;

                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).send(error500);
                        return;
                    })
                return;
            }
        })

    })
    .patch((req, res) => {
        console.log("PATCH /account");

        res.status(200).send(notImplemented);

    })

router.route("/account/login")
    .post((req, res) => {
        console.log("POST /account/login");      

        res.status(200).send(notImplemented);       

    })

router.route("/account/refresh")
    .post((req, res) => {
        console.log("POST /account/refresh");

        res.status(200).send(notImplemented);

    })

router.route("/account/feed")
    .post((req, res) => {
        console.log("POST /account/feed");

        res.status(200).send(notImplemented);

    })




/**
 * Community Endpoints
 *      /c              POST
 *      /c/search       GET
 *      /c/:id          GET, PATCH
 *      /c/:id/feed     GET
 *      /c/:id/join     POST, DELETE
 *      /c/:id/report   POST
 */
router.route("/c")
    .post(authenticateToken, validCommunity, (req, res) => {
        console.log("POST /c");

        const community = {
            name: req.body.name,
            description: req.body.description,
            moderators: [req.user._id]
        }

        Community.create(req.body).save()
            .then(data => {
                res.status(201).send(data);
                return;
            })
            .catch(err => {
                res.status(500).send(error500);
            })

    });

router.route("/c/search")
    .post((req, res) => {
        console.log("POST /c/search");

        res.status(200).send(notImplemented);

    });

router.route("/c/:commId")
    .get(existsCommunity, (req, res) => {
        console.log(`GET /c/${req.params.commId}`);

        res.status(200).send(req.community);

    })
    .patch((req, res) => {
        console.log(`PATCH /c/${req.params.commId}`);

        res.status(200).send(notImplemented);

    });

router.route("/c/:commId/feed")
    .get(existsCommunity, (req, res) => {
        console.log(`GET /c/${req.params.commId}/feed`);

        Question.find({ community: req.community._id })
            .sort('time')
            .then(data => {
                const body = {
                    num_returned: data.length,
                    questions: data
                }
                res.status(200).send(body);
            })
            .catch(err => {
                res.status(500).send(error500);
                })

    });

router.route("/c/:commId/join")
    .post(authenticateToken, existsCommunity, (req, res) => {
        console.log(`POST /c/${req.params.commId}/join`);

        Account.findByIdAndUpdate(req.user._id, {
            $addToSet: { communities: req.community._id }})
            .then(data => {
                res.status(204).send();
                return;
            })
            .catch(err => {
                console.log(err);
                res.status(500).send(error500);
                return;
            })

    })
    .delete(authenticateToken, existsCommunity, (req, res) => {
        console.log(`DELETE /c/${req.params.commId}/join`);

        Account.findByIdAndUpdate(req.user._id, {
            $pull: { communities: req.community._id}})
            .then(data => {
                res.status(204).send();
                return;
            })
            .catch(err => {
                console.log(err);
                res.status(500).send(error500);
                return;
            })
    })

router.route("/c/:commId/report")
    .post(authenticateToken, existsCommunity, validReport, (req, res) => {
        console.log(`POST /c/${req.params.commId}/report`);

        handleReport(req, res, req.community)

    });




/**
 * Question endpoints
 *      /c/:id/q                POST
 *      /c/:id/q/:id            GET
 *      /c/:id/q/:id/report     POST
 */
router.route("/c/:commId/q")
    .post(authenticateToken, existsCommunity, validQuestion, (req, res) => {
        console.log(`POST /c/${req.params.commId}/q`);

        const question = {
            community: req.community._id,
            author: req.user._id,
            time: Date.now(),
            title: req.body.title,
            content: req.body.content
        }

        Question.create(question).save()
            .then(data => {
                const body = JSON.parse(JSON.stringify(data));
                delete body.author;
                body.answers = [];

                res.status(201).send(body);
                return;
            })
            .catch(err => {
                console.log(err);
                res.status(500).send(error500);
                return;
            })

    });

router.route("/c/:commId/q/:quesId")
    .get(existsCommunity, existsQuestion, (req, res) => {
        console.log(`GET /c/${req.params.commId}/q/${req.params.quesId}`);

        const question = JSON.parse(JSON.stringify(req.question));
        delete question.author;

        Answer.find({ question: question._id })
            .sort('score')
            .then(data => {
                const answers = JSON.parse(JSON.stringify(data));
                answers.forEach(answer => {
                    delete answer.author
                });
                question.answers = answers;

                res.status(200).send(question);
                return;
            })
            .catch(err => {
                console.log(err);
                res.status(500).send(error500);
                return;
            })

    });

router.route("/c/:commId/q/:quesId/report")
    .post(authenticateToken, existsCommunity, existsQuestion, validReport, (req, res) => {
        console.log(`POST /c/${req.params.commId}/q/${req.params.quesId}/report`);

        handleReport(req, res, req.question)

    });



/**
 * Answer Endpoints
 *      /c/:id/q/:id/a                  POST
 *      /c/:id/q/:id/a/:id/upvote       POST, DELETE
 *      /c/:id/q/:id/a/:id/downvote     POST, DELETE
 *      /c/:id/q/:id/a/:id/report       POST
 */
router.route("/c/:commId/q/:quesId/a")
    .post(authenticateToken, existsCommunity, existsQuestion, validAnswer, (req, res) => {
        console.log(`POST /c/${req.params.commId}/q/${req.params.quesId}/a`);
        
        const answer = {
            content: req.body.content,
            community: req.community._id,
            question: req.question._id,
            author: req.user._id,
            time: Date.now(),
            score: 0
        }

        Answer.create(answer).save()
            .then(data => {
                res.status(204).send();
                return
            })
            .catch(err => done(err))

    });

router.route("/c/:commId/q/:quesId/a/:answId/upvote")
    .post(authenticateToken, existsCommunity, existsQuestion, existsAnswer, handleVote)
    .delete(authenticateToken, existsCommunity, existsQuestion, existsAnswer, handleVote);

router.route("/c/:commId/q/:quesId/a/:answId/downvote")
    .post(authenticateToken, existsCommunity, existsQuestion, existsAnswer, handleVote)
    .delete(authenticateToken, existsCommunity, existsQuestion, existsAnswer, handleVote)

router.route("/c/:commId/q/:quesId/a/:answId/report")
    .post(authenticateToken, existsCommunity, existsQuestion, existsAnswer, validReport, (req, res) => {
        console.log(`POST /c/${req.params.commId}/q/${req.params.quesId}/a/${req.params.answId}/report`);
        handleReport(req, res, req.answer);

    })


module.exports = router;