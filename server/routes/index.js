"use strict";

const router = require("express").Router();
const { ROOT: USER_ROUTES_ROOT } = require("../constants/routes/user");
const user = require("./user");

router.use(USER_ROUTES_ROOT, user.public)

module.exports = router;
