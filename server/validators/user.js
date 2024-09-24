"use strict";

const { body } = require("express-validator");
const { REGEX } = require("../constants/constants");

const userSignupInvite = [
    body("email").isEmail().withMessage("Please enter a correct email!"),
    body("name").isString().trim().isLength({ min: 2 }).withMessage("Please enter a name!"),
];

const userSignupSetPassword = [
    body("email").isEmail().withMessage("Please enter a correct email!"),
    body("password").isString().trim().matches(REGEX.PASSWORD).withMessage("Please enter a valid password!"),
    body("token").isString().trim().isLength({ min: 1 }).withMessage("Invalid token!"),
]

module.exports = {
    userSignupInvite,
    userSignupSetPassword
}