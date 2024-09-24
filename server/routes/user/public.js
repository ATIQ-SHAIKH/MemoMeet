const express = require("express");
const router = express.Router();
const { USER_ROUTES: { PUBLIC: USER_ROUTES } } = require("../../constants/routes");
const { signupInvite, signupSetPassword } = require("../../controller/user/auth");
const { userSignupInviteValidation, userSignupSetPasswordValidation } = require("../../validators");


router.post(USER_ROUTES.SIGNUP_INVITE, userSignupInviteValidation, signupInvite);

router.post(USER_ROUTES.SIGNUP_SET_PASSWORD, userSignupSetPasswordValidation, signupSetPassword);

module.exports = router;
