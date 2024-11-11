const express = require("express");
const router = express.Router();
const { USER_ROUTES: { PUBLIC: USER_ROUTES } } = require("../../constants/routes");
const { signupInvite, signupSetPassword, login, signin, logout, checkSession } = require("../../controller/user/auth");
const { userSignupInviteValidation, userSignupSetPasswordValidation, loginValidation, userSignInValidation } = require("../../validators");
const { jwtAuth } = require("../../middleware/auth");


// router.post(USER_ROUTES.SIGNUP_INVITE, userSignupInviteValidation, signupInvite);

// router.post(USER_ROUTES.SIGNUP_SET_PASSWORD, userSignupSetPasswordValidation, signupSetPassword);

// router.post(USER_ROUTES.LOGIN, loginValidation, login);

router.post(USER_ROUTES.SIGN_IN, userSignInValidation, signin);

module.exports = router;
