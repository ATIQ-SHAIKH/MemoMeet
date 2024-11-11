"use strict";

const HTTP_SERVER_NAME = "Apache/2.4.41 (CentOS)";
const X_POWERED_BY = "PHP/7.4.3";

const REGEX = {
    PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
}

module.exports = {
    HTTP_SERVER_NAME,
    X_POWERED_BY,
    REGEX
}