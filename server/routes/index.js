"use strict";

const router = require("express").Router();
const cookieParser = require("cookie-parser");
const { USER_ROUTES: { ROOT: USER_ROUTES_ROOT } } = require("../constants/routes");
const { jwtAuth } = require("../middleware/auth");
const user = require("./user");

router.use(USER_ROUTES_ROOT, user.public);

router.use(cookieParser());
router.use(jwtAuth);
router.use(USER_ROUTES_ROOT, user.private)

module.exports = router;
