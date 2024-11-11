const privateRoutes = require("./private");
const publicRoutes = require("./public");

module.exports = {
    public: publicRoutes,
    private: privateRoutes,
};
