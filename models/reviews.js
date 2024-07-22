const express = require("express");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema ({
    comment: {
        type: String,
        // required: [true, 'Path `comment` is required.']
    },
    rating : {
        type: Number,
        // required: [true, 'Path `rating` is required.'],
        min: 1,
        max: 5,
    },
    createdAt : {
        type: Date,
        default: Date.now,
        // required: [true, 'Path `createdAt` is required.']
    },
    author : {
        type: Schema.Types.ObjectId,
        ref: "User",
        // required: [true, 'Path `author` is required.']
    }
});

module.exports = mongoose.model("Review", reviewSchema);