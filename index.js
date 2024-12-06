const cors = require("cors");
const express = require("express");
const helmet = require("helmet");
const obscureHeader = require("./server/middleware/obscureHeader");
const {
    ALLOWED_DOMAIN,
    SCRIPT_SOURCES,
} = require("config");
require('dotenv').config();
const apiRoutes = require("./server/routes")

// Start & init express app
const app = express();
app.enable("trust proxy");
app.use(
    helmet.contentSecurityPolicy({
        defaultSrc: ["'self'"],
        scriptSrc: SCRIPT_SOURCES,
    }),
);
app.use(
    helmet({
        //contentSecurityPolicy: false,
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"], // Allow resources from the same origin
                scriptSrc: ["'self'", "'unsafe-inline'"], // Allow scripts from the same origin and inline scripts
                styleSrc: ["'self'", "'unsafe-inline'"], // Allow styles from the same origin and inline styles
                imgSrc: ["'self'", "data:"], // Allow images from the same origin and data URIs
                fontSrc: [
                    "'self'",
                    "https://fonts.googleapis.com",
                    "https://fonts.gstatic.com",
                ], // Example for Google Fonts
                objectSrc: ["'none'"], // Disallow embedding of objects
                frameSrc: ["'self'"], // Allow iframes from the same origin
                //upgradeInsecureRequests: true, // Upgrade HTTP to HTTPS automatically
                //reportUri: "/csp-violation" // Endpoint to report CSP violations (optional)
            },
        },
        hidePoweredBy: true,
    }),
);
app.use(obscureHeader);
app.use(
    express.json({
        limit: "2mb",
    }),
);
app.use(
    express.urlencoded({
        limit: "5mb",
        extended: true,
    }),
);
app.use(
    cors({
        origin: ALLOWED_DOMAIN,
        methods: ["GET", "POST", "DELETE", "PUT", "OPTIONS"],
        credentials: true,
    }),
);

app.get("/example", (req, res) => {
    console.log(req.ip); // Logs client's IP address
    res.send(`Client IP: ${req.ip}`);
});

// Load APIs
app.use("/api", apiRoutes);

// Serve static build files
app.get("/*", (_, res) =>
    res.json({ msg: "memomeet APIs" })
    // res.send(WELCOME_PAGE)
);

require("./server/models");

const { Server } = require("socket.io");

const server = app.listen(process.env.SRV_PORT, () =>
    console.log(`🚀 Server running at ${process.env.SRV_PORT}`),
);
const io = new Server(server);

io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

     // Join a specific room
  socket.on("join-room", (roomId) => {
    console.log(`User ${socket.id} joined room ${roomId}`);
    socket.join(roomId);
  });

  // Handle offer
  socket.on("offer", ({ roomId, offer }) => {
    socket.to(roomId).emit("offer", offer);
  });

  // Handle answer
  socket.on("answer", ({ roomId, answer }) => {
    socket.to(roomId).emit("answer", answer);
  });

  // Handle ICE candidates
  socket.on("candidate", ({ roomId, candidate }) => {
    socket.to(roomId).emit("candidate", candidate);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});
