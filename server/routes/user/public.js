const express = require("express");
const router = express.Router();
const { PUBLIC: ROUTES } = require("../../constants/routes/user");
const { signupInvite } = require("../../controller/user/auth");
const { userSignupInviteValidation } = require("../../validators");


router.post(ROUTES.SIGNUP_INVITE, userSignupInviteValidation, signupInvite)

module.exports = router;
