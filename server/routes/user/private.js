const express = require("express");
const router = express.Router();
const { USER_ROUTES: { PRIVATE: USER_ROUTES } } = require("../../constants/routes");
const { logout, checkSession } = require("../../controller/user/auth");

router.post(USER_ROUTES.LOGOUT, logout);

router.get(USER_ROUTES.CHECK_SESSION, checkSession);

module.exports = router;
