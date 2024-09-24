"use strict";

const router = require("express").Router();
const { USER_ROUTES: { ROOT: USER_ROUTES_ROOT } } = require("../constants/routes");
const user = require("./user");

router.use(USER_ROUTES_ROOT, user.public)

module.exports = router;
