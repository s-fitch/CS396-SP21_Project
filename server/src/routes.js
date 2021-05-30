"use strict";

const express = require("express");
const router = express.Router();

const notImplemented = {
    message: "This endpoint is planned but has not yet been implemented"
}

router.route("/")
    .get((req, res) => {
        console.log("GET /");
        res.status(200).send({
            data: "App is running."
        });
    });


/*
    Account endpoints
*/
router.route("/account")
    .post((req, res) => {
        console.log("POST /account");
        
        res.status(200).send(notImplemented);

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




/*
    Community endpoints
*/
router.route("/c")
    .post((req, res) => {
        console.log("POST /c");

        res.status(200).send(notImplemented);

    });

router.route("/c/search")
    .post((req, res) => {
        console.log("POST /c/search");

        res.status(200).send(notImplemented);

    });

router.route("/c/:commId")
    .get((req, res) => {
        console.log(`GET /c/${req.params.commId}`);

        res.status(200).send(notImplemented);

    })
    .patch((req, res) => {
        console.log(`PATCH /c/${req.params.commId}`);

        res.status(200).send(notImplemented);

    });

router.route("/c/:commId/feed")
    .get((req, res) => {
        console.log(`GET /c/${req.params.commId}/feed`);

        res.status(200).send(notImplemented);

    });

router.route("/c/:commId/join")
    .post((req, res) => {
        console.log(`POST /c/${req.params.commId}/join`);

        res.status(200).send(notImplemented);

    });

router.route("/c/:commId/report")
    .post((req, res) => {
        console.log(`POST /c/${req.params.commId}/report`);

        res.status(200).send(notImplemented);

    });




/*
    Question endpoints
*/
router.route("/c/:commId/q")
    .post((req, res) => {
        console.log(`POST /c/${req.params.commId}/q`);

        res.status(200).send(notImplemented);

    });

router.route("/c/:commId/q/:quesId")
    .post((req, res) => {
        console.log(`POST /c/${req.params.commId}/q/${req.params.quesId}`);

        res.status(200).send(notImplemented);

    });

router.route("/c/:commId/q/:quesId")
    .post((req, res) => {
        console.log(`POST /c/${req.params.commId}/q/${req.params.quesId}/report`);

        res.status(200).send(notImplemented);

    });



/*
    Answer endpoints
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


module.exports = router;