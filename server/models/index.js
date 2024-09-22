"use strict";

const { readdirSync } = require("fs");
const { connect, connection } = require("mongoose");
const { DB_INFO } = require("../constants/messages");

const CONNECTION_STATUS = {
    CONNECTING: "connecting",
    CONNECTED: "connected",
    DISCONNECTING: "disconnecting",
    DISCONNECTED: "disconnected"
}
const modelObj = {};

readdirSync("./server/models").forEach((file) => {
    if (!file.includes("index")) {
        const fileName = file.replace(".js", "");
        modelObj[fileName] = require(`./${fileName}`);
    }
});

connection.on(CONNECTION_STATUS.CONNECTING, () => {
    console.log(DB_INFO.MONGO_CONNECTING);
});
connection.on(CONNECTION_STATUS.CONNECTED, () => {
    console.log(DB_INFO.MONGO_CONNECTED);
});
connection.on(CONNECTION_STATUS.DISCONNECTING, () => {
    console.log(DB_INFO.MONGO_DISCONNECTING);
});
connection.on(CONNECTION_STATUS.DISCONNECTED, () => {
    console.log(DB_INFO.MONGO_DISCONNECTED);
});


connect(process.env.DB_URL);

module.exports = modelObj;
