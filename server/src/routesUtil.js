require("dotenv").config()
const jwt = require('jsonwebtoken');

const Community = require('./schema/Community');
const Question = require('./schema/Question');
const Answer = require('./schema/Answer');

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
     * Determine if account login request body is valid
     * @param {Object} body request body 
     * @returns {[boolean, Object]} JSON is parsed body if valid, otherwise error response body
     */
    this.validAccountLogin = (body) => {
        const format = this.formatLogin;

        // Contain needed properties?
        if (!this.isJsonFormatMatch(body, format)) {
            const err = this.errorBadFormat(format);
            return [false, err];
        }

        // Extract properties from response body
        const newBody = {};
        Object.keys(format).forEach(prop => newBody[prop]=body[prop]);
        
        // Valid email?
        // Parameters received from: https://www.w3resource.com/javascript/form/email-validation.php
        const regEmail = new RegExp("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$")
        if (!regEmail.test(newBody['email'])) {
            const err = this.errorBody("Provided email address is invalid");
            return [false, err];
        }

        // Request body is valid
        return [true, newBody];

    }

    /**
     * Package JSON Web Tokens into JSON object for response
     * @param {string} access JWT access token
     * @param {string} refresh JWT refresh token
     * @returns {Object}
     */
    this.packageTokens = (access, refresh) => {
        const body = {
            'access_token': access,
            'refresh_token': refresh
        }
        return body;
    }

    /**
     * Authenticate validity of the JWT authorization token
     * @param {Object} req 
     * @param {Object} res 
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
                    .send(this.errorBody('Invalid authorization token rpovided'));
                return;
            }
            req.user = decoded;
            next();
        })
    }

    /**
     * Validate and parse Community included in request body
     * @param {Object} req 
     * @param {Object} res 
     * @param {*} next 
     * @returns
     */
    this.validateCommunity = (req, res, next) => {
        const format = this.formatCommunity;
        const body = req.body;
        
        // Body included?
        if (!body) {
            res.status(400)
                .send(this.errorBody("No request body provided with request"));
            return;
        }

        // Contain needed properties?
        if (!this.isJsonFormatMatch(body, format)) {
            res.status(400)
                .send(this.errorBadFormat(format));
            return;
        }

        // Extract properties from body
        const newBody = {}
        Object.keys(format).forEach(prop => newBody[prop]=body[prop])

        req.data = newBody;
        next();
    }

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
}
module.exports = new Utils();