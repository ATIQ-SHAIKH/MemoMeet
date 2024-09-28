const express = require("express");
const router = express.Router();
const { USER_ROUTES: { PUBLIC: USER_ROUTES } } = require("../../constants/routes");
const { signupInvite, signupSetPassword, login } = require("../../controller/user/auth");
const { userSignupInviteValidation, userSignupSetPasswordValidation, loginValidation } = require("../../validators");


router.post(USER_ROUTES.SIGNUP_INVITE, userSignupInviteValidation, signupInvite);

router.post(USER_ROUTES.SIGNUP_SET_PASSWORD, userSignupSetPasswordValidation, signupSetPassword);

router.post(USER_ROUTES.LOGIN, loginValidation, login);

module.exports = router;
