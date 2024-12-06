const { v4: uuidv4 } = require('uuid');
const RESPONSES = require("../../constants/responseCodes");
const { GENERAL: GENERAL_MESSAGES } = require("../../constants/messages");
const DBFactory = require("../../manager/index");

const createMeetCode = async (req, res) => {
    console.log("createMeetCode")
    try {
        // Generate a unique meet code (you can use shorter or customized formats if needed)
        const meetDoc = { created_by: req.user.email, meet_code: uuidv4().split('-')[0] };

        const meetManager = DBFactory.loadModel("meet");
        const meetCodeInUse = await meetManager.countDocuments({ meet_code: { $regex: `/^${meetDoc.meet_code}/`, $options: "i" } });
        if (meetCodeInUse) meetDoc.meet_code = `${meetDoc.meet_code}-${meetCodeInUse + 1}`;
        const meet = await meetManager.create(meetDoc);
        console.log({ meet })
        if (!meet) return res.status(RESPONSES.INTERNAL_SERVER_ERROR).json({ msg: GENERAL_MESSAGES.SOME_UNKNOWN_ERROR_OCCURED })

        return res.json({ meet_code: meet.meet_code });
    } catch (e) {
        console.log(e);
        return res.status(RESPONSES.INTERNAL_SERVER_ERROR).json({ msg: GENERAL_MESSAGES.SOME_UNKNOWN_ERROR_OCCURED })
    }
}

module.exports = { createMeetCode }