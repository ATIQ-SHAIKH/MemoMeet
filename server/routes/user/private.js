const express = require("express");
const router = express.Router();
const { USER_ROUTES: { PRIVATE: USER_ROUTES } } = require("../../constants/routes");
const { logout, checkSession } = require("../../controller/user/auth");
const { createMeetCode } = require("../../controller/user/meet");

router.post(USER_ROUTES.LOGOUT, logout);

router.get(USER_ROUTES.CHECK_SESSION, checkSession);

router.post(USER_ROUTES.CREATE_MEET_CODE, createMeetCode)

module.exports = router;
