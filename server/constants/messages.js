"use strict";

module.exports = {
    GENERAL: {
        OK: "OK",
        SOME_UNKNOWN_ERROR_OCCURED: "Some unknown error occured"
    },
    ERROR: {
        MODEL_NAME_IS_REQUIRED: "Model name is required!",
        MODEL_DOES_NOT_EXIST:
            "Model doesnt exist. Please check for typo in model name."
    },
    DB_INFO: {
        MONGO_CONNECTING: "Mongo connecting",
        MONGO_CONNECTED: "Mongo connected",
        MONGO_DISCONNECTING: "Mongo disconnecting",
        MONGO_DISCONNECTED: "Mongo disconnected",
    },
    USER_SIGNUP: {
        ALREADY_SIGNED_UP: "This email already has an account, please login.",
        FAILED_TO_SEND_EMAIL: "Failed to send email!",
        EMAIL_SENT: "Email sent. Please check your email!",
        USER_NOT_FOUND: "User not found, please signup first!",
        USER_EXISTS_LOGIN: "This email is in use, try login!",
        TRY_SIGNUP_AGAIN: "Some error occured, Try signup again!",
        TOKEN_EXPIRED_TRY_SIGNUP_AGAIN: "Token has expired, Try signup again!",
        INVALID_TOKEN: "Invalid token!",
        TOKEN_VERIFIED_LOGIN: "Token verified! proceed to login!"
    }
}