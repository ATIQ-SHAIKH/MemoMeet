"use strict";

const { Schema, model } = require("mongoose");

const user = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true, index: true },
        password: { type: String },
        email_verification_info: {
            is_verified: { type: Boolean, default: false },
            verification_email_sent_on: { type: Date, required: true },
            verified_on: { type: Date, default: null },
            verification_token: { type: String, required: true },
            verification_token_expires_at: { type: Date }
        }
    },
    { timestamps: true },
);


module.exports = model("user", user);
