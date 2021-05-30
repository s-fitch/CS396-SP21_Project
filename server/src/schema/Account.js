"use strict"
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AccountSchema = new Schema({
    email: {
        type: Schema.Types.String,
        required: true
    },
    password: {
        type: Schema.Types.String,
        required: true
    },
    communities: [{
        type: Schema.Types.ObjectId,
        ref: "Community",
        required: true
    }],
    upvotes: [{
        type: Schema.Types.ObjectId,
        ref: "Answer",
        required: true
    }],
    downvotes: [{
        type: Schema.Types.ObjectId,
        ref: "Answer",
        required: true
    }]
});

AccountSchema.statics.create = function(obj) {
    const Account = mongoose.model("Account", AccountSchema);
    const account = new Account();
    account.email = obj.email;
    account.password = obj.password;
    account.communities = obj.communities;
    account.upvotes = obj.upvotes;
    account.downvotes = obj.downvotes;
    return account;
}

module.exports = mongoose.model("Account", AccountSchema);
