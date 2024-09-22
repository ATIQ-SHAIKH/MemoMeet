const models = require("../models");
const Manager = require("./manager");
const { ERROR } = require("../constants/messages");

class DBFactory {
    static loadModel(modelName) {
        try {
            if (!modelName) throw new Error(ERROR.MODEL_NAME_IS_REQUIRED);
            const model = models[`${modelName}`];
            if (!model) throw new Error(ERROR.MODEL_DOES_NOT_EXIST);
            return new Manager(model);
        } catch (e) {
            console.log(e.message);
        }
    }
}

module.exports = DBFactory;
