"use strict";

const RESPONSES = require("../constants/responseCodes");
const { validationResult } = require("express-validator");
const userRules = require("./user");
const validationRules = {};

const validate = (validationRules) => {
    return async (request, result, next) => {
        try {
            const error = {};
            await Promise.all(
                validationRules.map((validation) => validation.run(request))
            );
            const errors = validationResult(request);

            if (errors.isEmpty()) {
                return next();
            }

            error.errors = errors.array();
            console.log(JSON.stringify(error));
            return result.status(RESPONSES.BAD_REQUEST).json({ error });
        } catch (e) {
            return result
                .status(RESPONSES.BAD_REQUEST)
                .json({ msg: MESSAGES.INVALID_INPUT });
        }
    };
};

Object.keys(userRules).forEach((key) => {
    const keyName = key + "Validation";
    validationRules[keyName] = validate(userRules[key]);
});

module.exports = validationRules;
