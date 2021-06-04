const process = require("process");
require("dotenv").config();
const data = require("../../config/data.json");

const env = "" + process.env.NODE_ENV;
const configObj = require("../../config/config");
const config = configObj[env || "development"];

const mongoose = require("mongoose");
const resetDB = require("../../config/scripts/populateDB");
const Account = require("../../src/schema/Account");
const Community = require("../../src/schema/Community");
const Question = require("../../src/schema/Question");
const Answer = require("../../src/schema/Answer");

const axios = require("axios");

const Utils = function () {
    this.resetDB = resetDB;

    this.fixtures = {};

    this.mockAccount = {
        email: "fake@notrealwebsite.com",
        password: "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8"
    };
    this.mockCommunity = {
        name: "Testing Community",
        description: "This is a community devoted to testing out the server endpoints. If you're seeing this, congratulations! You got to witness me make some major mistake!"
    };
    this.mockQuestion = {
        title: "Testing Question",
        content: "Is this server endpoint working properly?"
    };
    this.mockAnswer = {};
    this.mockReport = {
        category: 1,
        detail: "This made me upset"
    }
    this.badId = "this_id_doesnt_conform";
    this.mockId = "FakeIdthatHasToBe24Chars";

    this.testAccount = data.accounts[0];
    this.testCommunity = data.communities[0];
    this.testQuestion = data.questions[0];
    this.testAnswer = data.answers[0];

    this.access_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MDc1MDI5Zjc0NmUzZjM4YTVmMGU5NDYiLCJpYXQiOjE2MjI3ODIzODh9.xTCfjMye-GY-NNQ_XqbwOQwJYD1DL6c4xnllB6nXHWc";
    this.refresh_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQHRlc3QuY29tIiwicGFzc3dvcmQiOiI4YzY5NzZlNWI1NDEwNDE1YmRlOTA4YmQ0ZGVlMTVkZmIxNjdhOWM4NzNmYzRiYjhhODFmNmYyYWI0NDhhOTE4IiwiaWF0IjoxNjIyNzgyMzg4fQ.FoyWIkOUyWhpVUQe0HZYHztf31UgfSzA2w39mFtJ35I";
    this.expired_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MDc1MDI5Zjc0NmUzZjM4YTVmMGU5NDYiLCJpYXQiOjE2MjI3ODIzODgsImV4cCI6MTYyMjc4MjM4OX0.fEbbkRHz-8dqEuc1SX6FoEXlmYwjbdrv9dYMo3QjX7M";

    this.formatToken = {
        access_token: "string",
        refresh_token: "string"
    }
    this.formatError = {
        message: "string"
    };

    this.route = (route) => {
        return (process.env.CURRENT_ENDPOINT || "http://localhost:8081") + route;
    }

    this.simplify = function(item) {
        const newItem = JSON.parse(JSON.stringify(item));
        delete newItem._id;
        delete newItem.__v;
        delete newItem.time;
        delete newItem.answers
        return newItem;
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

    this.isToken = function(item) {
        return this.isJsonFormatMatch(item, this.formatToken)
    }

    this.isError = function(item) {
        return this.isJsonFormatMatch(item, this.formatError);
    }

    
}
module.exports = new Utils();