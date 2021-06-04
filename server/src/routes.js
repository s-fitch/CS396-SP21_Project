"use strict";

require("dotenv").config()
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const utils = require("./routesUtil");
const Account = require("./schema/Account");
const Community = require("./schema/Community");
const Question = require("./schema/Question");

const {
    authenticateToken, existsCommunity
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
                res.status(500).send(utils.error500);
                return;
            } else {
                if (doc) {
                    // Email already in use
                    res.status(400).send(utils.errorBody(`Email address ${body['email']} is already in use`));
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
                        res.status(500).send(utils.error500);
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
    .post(authenticateToken, utils.validateCommunity, (req, res) => {
        console.log("POST /c");

        Community.create(req.data).save()
            .then(data => {
                console.log(data);
                res.status(201).send(data);
                return;
            })
            .catch(err => {
                console.log(err);
                res.status(500).send(utils.error500);
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

        console.log(req.community);
        res.status(200).send(req.community);

    })
    .patch((req, res) => {
        console.log(`PATCH /c/${req.params.commId}`);

        res.status(200).send(notImplemented);

    });

router.route("/c/:commId/feed")
    .get(existsCommunity, (req, res) => {
        console.log(`GET /c/${req.params.commId}/feed`);

        Question.find({community: req.params.commId})
            .sort('time')
            .then(data => {
                res.status(200).send(data);
            })
            .catch(err => {
                res.status(500).send(utils.error500);
                })

    });

router.route("/c/:commId/join")
    .post((req, res) => {
        console.log(`POST /c/${req.params.commId}/join`);

        res.status(200).send(notImplemented);

    })
    .delete((req, res) => {
        console.log(`DELETE /c/${req.params.commId}/join`);

        res.status(200).send(notImplemented);
    })

router.route("/c/:commId/report")
    .post((req, res) => {
        console.log(`POST /c/${req.params.commId}/report`);

        res.status(200).send(notImplemented);

    });




/**
 * Question endpoints
 *      /c/:id/q                POST
 *      /c/:id/q/:id            GET
 *      /c/:id/q/:id/report     POST
 */
router.route("/c/:commId/q")
    .post((req, res) => {
        console.log(`POST /c/${req.params.commId}/q`);

        res.status(200).send(notImplemented);

    });

router.route("/c/:commId/q/:quesId")
    .get((req, res) => {
        console.log(`GET /c/${req.params.commId}/q/${req.params.quesId}`);

        res.status(200).send(notImplemented);

    });

router.route("/c/:commId/q/:quesId/report")
    .post((req, res) => {
        console.log(`POST /c/${req.params.commId}/q/${req.params.quesId}/report`);

        res.status(200).send(notImplemented);

    });



/**
 * Answer Endpoints
 *      /c/:id/q/:id/a                  POST
 *      /c/:id/q/:id/a/:id/upvote       POST, DELETE
 *      /c/:id/q/:id/a/:id/downvote     POST, DELETE
 *      /c/:id/q/:id/a/:id/report       POST
 */
router.route("/c/:commId/q/:quesId/a")
    .post((req, res) => {
        console.log(`POST /c/${req.params.commId}/q/${req.params.quesId}/a`);

        res.status(200).send(notImplemented);

    });

router.route("/c/:commId/q/:quesId/a/:answId/upvote")
    .post((req, res) => {
        console.log(`POST /c/${req.params.commId}/q/${req.params.quesId}/a/${req.params.answId}/upvote`);

        res.status(200).send(notImplemented);

    })
    .delete((req, res) => {
        console.log(`POST /c/${req.params.commId}/q/${req.params.quesId}/a/${req.params.answId}/upvote`);

        res.status(200).send(notImplemented);

    });

router.route("/c/:commId/q/:quesId/a/:answId/downvote")
    .post((req, res) => {
        console.log(`POST /c/${req.params.commId}/q/${req.params.quesId}/a/${req.params.answId}/downvote`);

        res.status(200).send(notImplemented);

    })
    .delete((req, res) => {
        console.log(`POST /c/${req.params.commId}/q/${req.params.quesId}/a/${req.params.answId}/downvote`);

        res.status(200).send(notImplemented);
        
    })

router.route("/c/:commId/q/:quesId/a/:answId/report")
    .post((req, res) => {
        console.log(`POST /c/${req.params.commId}/q/${req.params.quesId}/a/${req.params.answId}/report`);

        res.status(200).send(notImplemented);

    })


module.exports = router;