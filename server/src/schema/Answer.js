"use strict"
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AnswerSchema = new Schema({
    community: {
        type: Schema.Types.ObjectId,
        ref: "Community",
        required: true
    },
    question: {
        type: Schema.Types.ObjectId,
        ref: "Question",
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
    body: {
        type: Schema.Types.String,
        required: true
    },
    score: {
        type: Schema.Types.Number,
        required: true
    }
});

QuestionSchema.statics.create = function(obj) {
    const Answer = mongoose.model("Answer", AnswerSchema);
    const answer = new Answer();
    answer.community = obj.community;
    answer.question = obj.question;
    answer.author = obj.author;
    answer.time = obj.time;
    answer.body = obj.body;
    answer.score = obj.score;
    return answer;
}

module.exports = mongoose.model("Answer", AnswerSchema);
