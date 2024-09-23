"use strict";

const crypto = require("crypto");
const sendEmail = require("../../services/nodemailer");
const RESPONSES = require("../../constants/responseCodes");
const { GENERAL: GENERAL_MESSAGES, USER_SIGNUP: USER_SIGNUP_MESSAGES } = require("../../constants/messages");
const DBFactory = require("../../manager/index");

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

module.exports = { signupInvite };