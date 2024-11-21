"use strict";

const { Schema, model } = require("mongoose");

const meet = new Schema(
    {
        name: { type: String, required: true },
        meet_code: { type: String, required: true, unique: true },
        created_by: { type: String, required: true }, // email of the user
    },
    { timestamps: true },
);


module.exports = model("meet", meet);
