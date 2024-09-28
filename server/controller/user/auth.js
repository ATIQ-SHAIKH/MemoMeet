"use strict";

const crypto = require("crypto");
const sendEmail = require("../../services/nodemailer");
const RESPONSES = require("../../constants/responseCodes");
const { GENERAL: GENERAL_MESSAGES, USER_SIGNUP: USER_SIGNUP_MESSAGES, USER_LOGIN: USER_LOGIN_MESSAGES } = require("../../constants/messages");
const DBFactory = require("../../manager/index");
const { jwtSign } = require("../../middleware/auth")

const signupInvite = async (req, res) => {
    console.log("signupInvite")
    try {
        const { name, email } = req.body;
        const userManager = DBFactory.loadModel("user");
        const user = await userManager.findOne({ email });
        const currentDate = new Date();
        if (user) {
            const { email_verification_info: { is_verified } } = user;
            if (is_verified) return res.status(RESPONSES.CONFLICT).json({ msg: USER_SIGNUP_MESSAGES.ALREADY_SIGNED_UP });
            const verificationToken = crypto.randomBytes(32).toString("hex");
            const { modifiedCount } = await userManager.updateOne({ _id: user._id }, { $set: { name, email_verification_info: { is_verified: false, verification_email_sent_on: new Date(), verification_token: verificationToken, verification_token_expires_at: new Date(currentDate.getTime() + 24 * 60 * 60 * 1000) } } })
            if (!modifiedCount) return res.status(RESPONSES.INTERNAL_SERVER_ERROR).json({ msg: GENERAL_MESSAGES.SOME_UNKNOWN_ERROR_OCCURED });
            const sent = sendEmail(email, "MemoMeet: Email Verification", `Click on this link to verify your email: https://localhost:8000/api/user/email=${email}&&token=${verificationToken}`);
            if (!sent) return res.status(RESPONSES.INTERNAL_SERVER_ERROR).json({ msg: USER_SIGNUP_MESSAGES.FAILED_TO_SEND_EMAIL });
            else return res.json({ msg: USER_SIGNUP_MESSAGES.EMAIL_SENT });
        }
        const verificationToken = crypto.randomBytes(32).toString("hex");
        const sent = sendEmail(email, "MemoMeet: Email Verification", `Click on this link to verify your email: https://localhost:8000/api/user/email=${email}&&token=${verificationToken}`);
        if (!sent) return res.status(RESPONSES.INTERNAL_SERVER_ERROR).json({ msg: USER_SIGNUP_MESSAGES.FAILED_TO_SEND_EMAIL });
        const newUser = await userManager.create({
            name,
            email,
            email_verification_info: {
                is_verified: false,
                verification_email_sent_on: new Date(),
                verification_token: verificationToken,
                verification_token_expires_at: new Date(currentDate.getTime() + 24 * 60 * 60 * 1000)
            }
        });
        if (!newUser) return res.status(RESPONSES.INTERNAL_SERVER_ERROR).json({ msg: GENERAL_MESSAGES.SOME_UNKNOWN_ERROR_OCCURED })
        return res.json({ msg: USER_SIGNUP_MESSAGES.EMAIL_SENT })
    } catch (e) {
        console.log(e);
        return res.status(RESPONSES.INTERNAL_SERVER_ERROR).json({ msg: GENERAL_MESSAGES.SOME_UNKNOWN_ERROR_OCCURED })
    }
};

const signupSetPassword = async (req, res) => {
    console.log("signupSetPassword")
    try {
        const { email, password, token } = req.body;
        const userManager = DBFactory.loadModel("user");
        const user = await userManager.findOne({ email }, { email_verification_info: 1 });

        const now = new Date();
        const { email_verification_info: { verification_token, verification_token_expires_at } } = user;

        // check if user exists
        if (!user) return res.status(RESPONSES.NOT_FOUND).json({ msg: USER_SIGNUP_MESSAGES.USER_NOT_FOUND });
        // check if user has not set the password already
        else if (user.password) return res.status(RESPONSES.CONFLICT).json({ msg: USER_SIGNUP_MESSAGES.USER_EXISTS_LOGIN });
        // check if verification token exists for the user
        else if (!verification_token) return res.status(RESPONSES.INTERNAL_SERVER_ERROR).json({ msg: USER_SIGNUP_MESSAGES.TRY_SIGNUP_AGAIN });
        // check if token has not expired
        else if (now.getTime() > verification_token_expires_at.getTime()) return res.status(RESPONSES.GONE).json({ msg: USER_SIGNUP_MESSAGES.TOKEN_EXPIRED_TRY_SIGNUP_AGAIN });
        // check if token is correct
        else if (token !== verification_token) return res.status(RESPONSES.FORBIDDEN).json({ msg: USER_SIGNUP_MESSAGES.INVALID_TOKEN });

        const { modifiedCount } = await userManager.updateOne({ email }, { $set: { password, "email_verification_info.is_verified": true, "email_verification_info.verified_on": now } });
        if (!modifiedCount) return res.status(RESPONSES.INTERNAL_SERVER_ERROR).json({ msg: GENERAL_MESSAGES.SOME_UNKNOWN_ERROR_OCCURED });

        return res.json({ msg: USER_SIGNUP_MESSAGES.TOKEN_VERIFIED_LOGIN })
    } catch (e) {
        console.log(e);
        return res.status(RESPONSES.INTERNAL_SERVER_ERROR).json({ msg: GENERAL_MESSAGES.SOME_UNKNOWN_ERROR_OCCURED })
    }
}

const login = async (req, res) => {
    console.log("login")
    try {
        const { email, password } = req.body;
        const userManager = DBFactory.loadModel("user");
        const user = await userManager.findOne({ email });

        // check if user exists
        if (!user) return res.status(RESPONSES.NOT_FOUND).json({ msg: USER_LOGIN_MESSAGES.USER_NOT_FOUND });
        const { password: password_in_db, email_verification_info: { is_verified } } = user;
        // check if user is verified
        if (!is_verified) return res.status(RESPONSES.UNAUTHORIZED).json({ msg: USER_LOGIN_MESSAGES.CHECK_EMAIL });
        // check if password is correct
        else if (password !== password_in_db) return res.status(RESPONSES.INTERNAL_SERVER_ERROR).json({ msg: USER_LOGIN_MESSAGES.INVALID_PASSWORD })

        const token = await jwtSign({ _id: user._id, email });

        return res.json({ msg: USER_LOGIN_MESSAGES.LOGGED_IN, data: { token } });
    } catch (e) {
        console.log(e);
        return res.status(RESPONSES.INTERNAL_SERVER_ERROR).json({ msg: GENERAL_MESSAGES.SOME_UNKNOWN_ERROR_OCCURED })
    }
}

module.exports = { signupInvite, signupSetPassword, login };