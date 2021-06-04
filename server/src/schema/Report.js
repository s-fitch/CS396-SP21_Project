"use strict"
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ReportSchema = new Schema({
    category: {
        type: Schema.Types.Number,
        required: true
    },
    detail: {
        type: Schema.Types.String,
        required: true
    },
    reporter: {
        type: Schema.Types.ObjectId,
        ref: "Account",
        required: true
    },
    item: {
        type: Schema.Types.Mixed,
        required: true
    },
    time: {
        type: Schema.Types.Date,
        required: true
    }
});

ReportSchema.statics.create = function(obj) {
    const Report = mongoose.model("Report", ReportSchema);
    const report = new Report();
    report.category = obj.category;
    report.detail = obj.detail;
    report.reporter = obj.reporter;
    report.item = obj.item;
    report.time = obj.time;
    return report;
}

module.exports = mongoose.model("Report", ReportSchema);
