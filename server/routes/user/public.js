const express = require("express");
const router = express.Router();
const { PUBLIC: ROUTES } = require("../../constants/routes/user");
const { signupInvite } = require("../../controller/user/auth");

// import VALIDATORS from "../../validators";

// const { } = VALIDATORS;

router.post(ROUTES.SIGNUP, signupInvite)

module.exports = router;
