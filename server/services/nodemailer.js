const { EMAIL_CONFIG } = require("config");
const nodemailer = require("nodemailer");


const transporter = nodemailer.createTransport({
    service: EMAIL_CONFIG.SERVICE,
    host: EMAIL_CONFIG.HOST,
    port: EMAIL_CONFIG.PORT,
    secure: EMAIL_CONFIG.SECURE,
    auth: {
			"user": process.env.EMAIL_CONFIG_AUTH_USER,
			"pass": process.env.EMAIL_CONFIG_AUTH_PASS
		}
});

/**
 * Function to send mail with either text or HTML string
 * @param {String} to
 * @param {String} subject
 * @param {String} text
 * @param {String} html
 * @returns {Boolean}
 */
module.exports = async (to, subject, text, html) => {
    try {
        if (!(to && subject && (text || html))) return false;

        const mailOptions = {
            from: EMAIL_CONFIG.EMAIL,
            to,
            subject,
        };

        if (text) mailOptions.text = text;
        else mailOptions.html = html;

        const { response } = await transporter.sendMail(mailOptions);
        const success = response.split(" ")[2];
        return success === "OK";
    } catch (e) {
        logger.error(e);
        return false;
    }
};
