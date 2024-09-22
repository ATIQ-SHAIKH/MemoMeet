"use strict";

const { HTTP_SERVER_NAME, X_POWERED_BY } = require("../constants/constants.js");

const obscureHeader = (_, res, next) => {
	res.setHeader("X-Powered-By", X_POWERED_BY);
	res.setHeader("Server", HTTP_SERVER_NAME);
	next();
};

module.exports = obscureHeader;