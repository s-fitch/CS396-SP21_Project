"use strict"
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommunitySchema = new Schema({
    name: {
        type: Schema.Types.String,
        requied: true
    },
    description: {
        type: Schema.Types.String,
        required: true
    },
    moderators: [{
        type: Schema.Types.ObjectId,
        ref: "Account",
        required: true
    }]
})

CommunitySchema.statics.create = function(obj) {
    const Community = mongoose.model("Community", CommunitySchema);
    const community = new Community();
    community.name = obj.name;
    community.description = obj.description;
    community.moderators = obj.moderators;
    return community;
}

module.exports = mongoose.model("Community", CommunitySchema);
