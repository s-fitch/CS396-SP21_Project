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

    this.fixtures = {};

    this.mockAccount = {
        email: "fake@notrealwebsite.com",
        password: "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8"
    };
    this.mockCommunity = {};
    this.mockQuestion = {};
    this.mockAnswer = {};

    this.mockId= "a_very_fake_id";

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

    this.isValidToken = function(item) {
        return this.isJsonFormatMatch(item, this.formatToken)
    }

    this.isValidError = function(item) {
        return this.isJsonFormatMatch(item, this.formatError);
    }

    
}
module.exports = new Utils();