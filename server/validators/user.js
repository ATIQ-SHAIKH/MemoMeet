"use strict";

const { body } = require("express-validator");

const userSignupInvite = [
    body("email").isEmail().withMessage("Please enter a correct email!"),
    body("name").isString().trim().isLength({ min: 2 }).withMessage("Please enter a name!"),
]

module.exports = {
    userSignupInvite
}