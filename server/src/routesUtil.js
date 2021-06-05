require("dotenv").config()
const jwt = require('jsonwebtoken');

const Community = require('./schema/Community');
const Question = require('./schema/Question');
const Answer = require('./schema/Answer');
const Report = require('./schema/Report');

const Utils = function () {
    // Request body formats
    this.formatLogin = {
        email: "string",
        password: "string"
    }
    this.formatRefresh = {
        refresh_token: "string"
    }
    this.formatCommunity = {
        name: "string",
        description: "string"
    }
    this.formatQuestion = {
        title: "string",
        content: "string"
    }
    this.formatAnswer = {
        content: "string"
    }
    this.formatReport = {
        category: "number",
        detail: "string"
    }
    

    /**
     * Generic constructor for error resonse body
     * @param {string} msg 
     * @returns {Object}
     */
    this.errorBody = (msg) => {
        const err = {
            message: msg
        }
        return err;
    }

    this.error500 = this.errorBody('An unexpected error occured in processing the request');
    this.errorMissingBody = this.errorBody('No request body provided with request')

    /**
     * Builds error response body for request not matching format
     * @param {Object} format template format
     * @returns {Object} error response body
     */
    this.errorBadFormat = (format) => {
        return this.errorBody("Request body must conform to the following format: " + JSON.stringify(format));
    }

    /**
     * Determines if test item has same type as trueType
     * @param {*} test 
     * @param {(string|string[])} trueType 
     * @returns {boolean} Whether or not the test item matches the true type
     */
    const isTypeMatch = (test, trueType) => {
        if (Array.isArray(trueType)) {
            return (Array.isArray(test) && test.every(elem => typeof(elem)===trueType[0]));
        }
        return typeof(test) === trueType;
    }

    /**
     * Determines if JSON body format matches template format
     * @param {Object} body 
     * @param {Object} format 
     * @returns {boolean}
     */
    this.isJsonFormatMatch = (body, format) => {
        

        if (!Object.keys(format).every(prop => body.hasOwnProperty(prop))) {
            return false
        }
        if (!Object.keys(format).every(prop => isTypeMatch(body[prop], format[prop]))) {
            return false
        }

        return true
    }

    /**
     * Package JSON Web Tokens into JSON object for response
     * @param {string} access JWT access token
     * @param {string} refresh JWT refresh token
     * @returns {Object}
     */
    this.packageTokens = (access, refresh) => {
        
    }
    /**
     * Generate JSON Web Tokens for authentication
     * @param {Object} data Account data from query
     * @returns {Object} packaged token response
     */
    this.createTokens = (data) => {
        const access_token = jwt.sign(
            { _id: data['_id'], iat: Math.floor(Date.now() / 1000)},
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn: '6h'}
        );
        const refresh_token = jwt.sign(
            { email: data['email'], password: data['password'], iat: Math.floor(Date.now() /1000)},
            process.env.REFRESH_TOKEN_SECRET,
            {expiresIn: '14d'}
        );

        const tokens = {
            'access_token': access_token,
            'refresh_token': refresh_token
        }
        return tokens;
    }

    /**
     * Authenticate validity of the JWT authorization token
     * @param {Object} req Express routing request object 
     * @param {Object} res Express routing response object 
     * @param {*} next 
     * @returns {None}
     */
    this.authenticateToken = (req, res, next) => {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]

        if (!token) {
            // Missing token
            res.status(401)
                .send(this.errorBody('No authorizatoin token provided'));
            return;
        }

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                // Invalid token
                res.status(403)
                    .send(this.errorBody('Invalid authorization token provided'));
                return;
            }
            req.user = decoded;
            next();
        })
    }


    
    /**
     * Validates request body based on provided JSON format structure
     * @param {Object} req Express routing request object 
     * @param {Object} res Express routing response object 
     * @param {*} next 
     * @param {Object} format structure that request body must adhere to
     * @returns 
     */
    const validGeneric = (req, res, next, format) => {
        const body = req.body;
        
        // Body included?
        if (!body) {
            res.status(400)
                .send(this.errorMissingBody);
            return;
        }

        // Adheres to format?
        if (!this.isJsonFormatMatch(body, format)) {
            res.status(400)
                .send(this.errorBadFormat(format));
            return;
        }

        // Extract properties from body
        const newBody = {}
        Object.keys(format).forEach(prop => newBody[prop]=body[prop]);

        req.body = newBody;
        if (next) {
            next();
        } else {
            return;
        }
    }
    /**
     * Determine if account login request body is valid
     * @param {Object} body request body 
     * @returns {[boolean, Object]} JSON is parsed body if valid, otherwise error response body
     */
     this.validAccountLogin = (req, res, next) => {
        const format = this.formatLogin;
        // Valid body?
        validGeneric(req, res, null, format);

        // Valid email?
        // Parameters received from: https://www.w3resource.com/javascript/form/email-validation.php
        const regEmail = new RegExp("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$")
        if (!regEmail.test(req.body.email)) {
            res.status(400).send(this.errorBody("Email address is already in use"));
            return;
        }

        next();

    }
    /**
     * Validate and parse Refresh token included in request body
     * @param {Object} req Express routing request object 
     * @param {Object} res Express routing response object 
     * @param {*} next 
     * @returns 
     */
    this.validRefresh = (req, res, next) => validGeneric(req, res, next, this.formatRefresh);
    /**
     * Validate and parse Community included in request body
     * @param {Object} req Express routing request object 
     * @param {Object} res Express routing response object 
     * @param {*} next 
     * @returns
     */
    this.validCommunity = (req, res, next) => validGeneric(req, res, next, this.formatCommunity);
    /**
     * Validate and parse Question included in request body
     * @param {Object} req Express routing request object 
     * @param {Object} res Express routing response object 
     * @param {*} next 
     * @returns 
     */
    this.validQuestion = (req, res, next) => validGeneric(req, res, next, this.formatQuestion);
    /**
     * Validate and parse Answer included in request body
     * @param {Object} req Express routing request object 
     * @param {Object} res Express routing response object 
     * @param {*} next 
     * @returns 
     */
    this.validAnswer = (req, res, next) => validGeneric(req, res, next, this.formatAnswer);
    /**
     * Validate and parse Report included in request body
     * @param {Object} req Express routing request object 
     * @param {Object} res Express routing response object 
     * @param {*} next 
     * @returns 
     */
    this.validReport = (req, res, next) => validGeneric(req, res, next, this.formatReport);
    


    /**
     * Confirm Community exists and retreive its information in process
     * @param {Object} req Express routing request object 
     * @param {Object} res Express routing response object 
     * @param {*} next 
     * @returns 
     */
    this.existsCommunity = (req, res, next) => {
        if (!req.params.commId) {
            res.status(400).send(this.errorBody('ID of relevant Community must be included in the request path'));
            return;
        }

        Community.findById(req.params.commId)
            .then(data => {
                if (!data) {
                    res.status(404).send(this.errorBody('Community with specified ID does not exist'));
                    return;
                }

                req.community = data;
                next();
            })
            .catch(err => {
                res.status(404).send(this.errorBody('Community with specified ID does not exist'));
                return;
            })
    }
    /**
     * Confirm Question exists and retreive its information in process
     * @param {Object} req Express routing request object 
     * @param {Object} res Express routing response object 
     * @param {*} next 
     * @returns 
     */
    this.existsQuestion = (req, res, next) => {
        if (!req.params.quesId) {
            res.status(400).send(this.errorBody('ID of relevant question must be included in the request path'))
            return;
        }

        Question.findById(req.params.quesId)
            .then(data => {
                if (!data) {
                    res.status(404).send(this.errorBody('Question with specified ID does not exist'));
                    return;
                }

                if (String(data.community) !== String(req.community._id)) {
                    res.status(404).send(this.errorBody('Question with specified ID does not exist'));
                    return;
                }

                req.question = data;
                next();
            })
            .catch(err => {
                res.status(404).send(this.errorBody('Question with specified ID does not exist'));
                return;
            })
    }
    /**
     * Confirm Answer exists and retreive its information in the process
     * @param {Object} req Express routing request object 
     * @param {Object} res Express routing response object 
     * @param {*} next 
     * @returns 
     */
    this.existsAnswer = (req, res, next) => {
        if (!req.params.quesId) {
            res.status(400).send(this.errorBody('ID of relevant answer must be included in the request path'));
            return;
        }

        Answer.findById(req.params.answId)
            .then(data => {
                if (!data) {
                    res.status(404).send(this.errorBody('Answer with specified ID does not exist'));
                    return;
                }

                if (String(data.question) != String(req.question._id)) {
                    res.status(404).send(this.errorBody('Answer with specified ID does not exist'));
                    return;
                }

                req.answer = data;
                next();
            })
    }

    /**
     * Generic function used to handle all error reporting for the various endpoints
     * @param {Object} req Express routing request object 
     * @param {Object} res Express routing response object 
     * @param {Object} item full entry of item being reported at time of reporting
     */
    this.handleReport = (req, res, item) => {
        const report = {
            category: Number(req.body.category),
            detail: req.body.detail,
            reporter: req.user._id,
            time: Date.now(),
            item: item
        }

        Report.create(report).save()
            .then(response => {
                res.status(204).send();
                return;
            })
            .catch(err => {
                console.log(err);
                res.status(500).send(error500);
                return;
            })
    }
    /**
     * Handles all of the vote changes associated with answers
     * @param {Object} req Express routing request object 
     * @param {Object} res Express routing response object 
     * @param {string} type Either 'upvote' or 'downvote'
     * @param {string} verb Either 'POST' or 'DELETE'
     */
    this.handleVote = (req, res) => {
        const splitPath = req.route.path.split('/')
        const voteType = splitPath[splitPath.length-1]
        const verb = Object.keys(req.route.path.methods)[0]
        
        console.log(`${verb} /c/${req.params.commId}/q/${req.params.quesId}/a/${req.params.answId}/${voteType}`);

        let alreadyDone;
        let voteList;
        let scoreChange;

        if ((voteType === 'upvote' && verb === 'POST') ||
            (voteType === 'downvote' && verb === 'DELETE')) {
                alreadyDone = (a, b) => (a in b);
                voteList = 'upvotes';
                scoreChange = {$inc: {score:1}};
        } else {
            alreadyDone = (a, b) => !(a in b);
            voteList = 'downvotes';
            scoreChange = {$dec: {score:1}};
        }

        Account.findById(req.user._id)
            .then(data => {
                if (alreadyDone(answer._id, data.voteList)) {
                    res.status(204).send();
                    return;
                }


                data.voteList.push(req.params.quesId);
                Account.findByIdAndUpdate(req.user._id, {voteList: data.voteList})
                    .then(data => {
                        Answer.findByIdAndUpdate(req.answer._id, scoreChange)
                        .then(data => {
                            res.status(204).send();
                        })
                        .catch(err => {
                            console.log(err);
                            res.status(500).send(error500);
                        })
                    })
            })

    }
}
module.exports = new Utils();