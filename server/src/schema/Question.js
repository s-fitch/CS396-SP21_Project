"use strict"
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const QuestionSchema = new Schema({
    community: {
        type: Schema.Types.ObjectId,
        ref: "Community",
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "Account",
        required: true
    },
    time: {
        type: Schema.Types.Date,
        required: true
    },
    title: {
        type: Schema.Types.String,
        required: true
    },
    content: {
        type: Schema.Types.String,
        required: true
    }
});

QuestionSchema.statics.create = function(obj) {
    const Question = mongoose.model("Question", QuestionSchema);
    const question = new Question();
    question.community = obj.community;
    question.author = obj.author;
    question.time = obj.time;
    question.title = obj.title;
    question.body = obj.body;
    return question;
}

module.exports = mongoose.model("Question", QuestionSchema);
