"use strict";

const Account = require("../../src/schema/Account");
const Community = require("../../src/schema/Community");
const Question = require("../../src/schema/Question");
const Answer = require("../../src/schema/Answer");
const data = require("../data.json");
require("dotenv").config();

const env = "" + process.env.NODE_ENV;

const configObj = require("../config");
const config = configObj[env || "development"];
const mongoose = require("mongoose");


const populate = (callback) => {
    mongoose.connect(config.database, config.mongoConfig, err => {
        if (err) {
            console.log("Could not connect to database.");
        }
        const schemas = [Account, Community, Question, Answer];
        Promise
            // Delete all existing data
            .all(
                schemas.map(schema => schema.deleteMany())
            )
            // Insert initial data
            .then(() => {
                return Account.insertMany(data.accounts);
            })
            .then(() => {
                return Community.insertMany(data.communities);
            })
            .then(() => {
                return Question.insertMany(data.questions);
            })
            .then(() => {
                return Answer.insertMany(data.answers);
            })
            .catch(err => {
                console.log(err);
                process.exit(1);
            })
            .finally(() => {
                if (callback) {
                    callback();
                } else {
                    console.log('Exiting');
                    process.exit(0);
                }
            });
    });
};

module.exports = populate;
